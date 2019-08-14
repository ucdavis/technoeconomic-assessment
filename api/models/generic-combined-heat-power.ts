import { CashFlowCHP, GenericCombinedHeatPowerInputMod, TotalCashFlowCHP } from './generic-combined-heat-power.model';

function GenericCombinedHeatPower(input: GenericCombinedHeatPowerInputMod) {
    // Electrical and Fuel--base year
    const ParasiticLoad = input.GrossElectricalCapacity - input.NetElectricalCapacity;
    const AnnualHours = input.CapacityFactor / 100 * 8760;
    const FuelConsumptionRate = input.NetElectricalCapacity / (input.NetStationEfficiency / 100) * 3600
        / input.FuelHeatingValue / 1000;
    const FuelPower = FuelConsumptionRate * 1000 * input.FuelHeatingValue / 3600;
    const GrossStationElectricalEfficiency = input.GrossElectricalCapacity / FuelPower * 100;
    const AnnualNetGeneration = input.NetElectricalCapacity * 8760 * input.CapacityFactor / 100;
    const AnnualFuelConsumption = FuelConsumptionRate * AnnualHours;
    const CapitalCostNEC = input.CapitalCost / input.NetElectricalCapacity;
    const AnnualAshDisposal = AnnualFuelConsumption * input.FuelAshConcentration / 100;
    // Heat-base year
    const TotalHeatProductionRate = FuelPower - input.GrossElectricalCapacity;
    const RecoveredHeat = TotalHeatProductionRate * input.AggregateFractionOfHeatRecovered / 100;
    const AnnualHeatSales = RecoveredHeat * AnnualHours;
    const TotalIncomeFromHeatSales = AnnualHeatSales * input.AggregateSalesPriceForHeat;
    const HeatIncomePerUnitNEE = TotalIncomeFromHeatSales / AnnualNetGeneration;
    const OverallCHPefficiencyGross = (input.GrossElectricalCapacity * AnnualHours + AnnualHeatSales)
        / (FuelPower * AnnualHours) * 100;
    const OverallCHPefficiencyNet = (AnnualNetGeneration + AnnualHeatSales) / (FuelPower * AnnualHours) * 100;
    // Expenses--base year
    const TotalNonFuelExpenses = input.LaborCost + input.MaintenanceCost + input.InsurancePropertyTax + input.Utilities
        + input.AshDisposal + input.Management + input.OtherOperatingExpenses;
    const TotalExpensesIncludingFuel = input.FuelCost * AnnualFuelConsumption + TotalNonFuelExpenses;
    const FuelCostKwh = CalcKwh(AnnualFuelConsumption * input.FuelCost);
    const LaborCostKwh = CalcKwh(input.LaborCost);
    const MaintenanceCostKwh = CalcKwh(input.MaintenanceCost);
    const InsurancePropertyTaxKwh = CalcKwh(input.InsurancePropertyTax);
    const UtilitiesKwh = CalcKwh(input.Utilities);
    const AshDisposalKwh = CalcKwh(input.AshDisposal);
    const ManagementKwh = CalcKwh(input.Management);
    const OtherOperatingExpensesKwh = CalcKwh(input.OtherOperatingExpenses);
    const TotalNonFuelExpensesKwh = LaborCostKwh + MaintenanceCostKwh + InsurancePropertyTaxKwh
        + UtilitiesKwh + AshDisposalKwh + ManagementKwh + OtherOperatingExpensesKwh;
    const TotalExpensesIncludingFuelKwh = FuelCostKwh + TotalNonFuelExpensesKwh;
    function CalcKwh(cost: number) {
        return cost / AnnualNetGeneration;
    }
    // Taxes
    const CombinedTaxRate = input.StateTaxRate + input.FederalTaxRate * (1 - input.StateTaxRate / 100);
    // Financing
    const EquityRatio = 100 - input.DebtRatio;
    const CostOfMoney = input.DebtRatio / 100 * input.InterestRateOnDebt + EquityRatio / 100 * input.CostOfEquity;
    const TotalCostOfPlant = input.CapitalCost;
    const TotalEquityCost = TotalCostOfPlant * EquityRatio / 100;
    const TotalDebtCost = TotalCostOfPlant * input.DebtRatio / 100;
    const CapitalRecoveryFactorEquity = CapitalRecoveryFactor(input.CostOfEquity, input.EconomicLife);
    const CapitalRecoveryFactorDebt = CapitalRecoveryFactor(input.InterestRateOnDebt, input.EconomicLife);
    const AnnualEquityRecovery = CapitalRecoveryFactorEquity * TotalEquityCost;
    const AnnualDebtPayment = TotalDebtCost * CapitalRecoveryFactorDebt;
    const DebtReserve = AnnualDebtPayment;
    function CapitalRecoveryFactor(i: number, N: number) {
        const A = i / 100 * Math.pow((1 + i / 100), N) / (Math.pow((1 + i / 100), N) - 1);
        return A;
    }
    // Income other than energy
    const AnnualCapacityPayment = input.CapacityPayment * input.NetElectricalCapacity;
    const AnnualDebtReserveInterest = DebtReserve * input.InterestRateonDebtReserve / 100;
    // Depreciation Schedule
    const DepreciationFraction = 1 / input.EconomicLife;
    // Annual Cash Flows
    const cashFlow = [];
    for (let i = 0; i < input.EconomicLife; i++) {
        const newCF: CashFlowCHP = { Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                     EquityPrincipalRemaining: 0, DebtRecovery: 0, DebtInterest: 0,
                                     DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, FuelCost: 0,
                                     NonFuelExpenses: 0, DebtReserve: 0, Depreciation: 0, CapacityIncome: 0,
                                     HeatSalesIncome: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0, TaxCredit: 0,
                                     Taxes: 0, EnergyRevenueRequired: 0 };
        cashFlow.push(newCF);
    }
    // Year 1
    cashFlow[0].Year = 1;
    cashFlow[0].EquityRecovery = AnnualEquityRecovery;
    cashFlow[0].EquityInterest = input.CostOfEquity / 100 * TotalEquityCost;
    cashFlow[0].EquityPrincipalPaid = cashFlow[0].EquityRecovery - cashFlow[0].EquityInterest;
    cashFlow[0].EquityPrincipalRemaining = TotalEquityCost - cashFlow[0].EquityPrincipalPaid;
    cashFlow[0].DebtRecovery = AnnualDebtPayment;
    cashFlow[0].DebtInterest = input.InterestRateOnDebt / 100 * TotalDebtCost;
    cashFlow[0].DebtPrincipalPaid = cashFlow[0].DebtRecovery - cashFlow[0].DebtInterest;
    cashFlow[0].DebtPrincipalRemaining = TotalDebtCost - cashFlow[0].DebtPrincipalPaid;
    cashFlow[0].FuelCost = AnnualFuelConsumption * input.FuelCost;
    cashFlow[0].NonFuelExpenses = TotalNonFuelExpenses;
    cashFlow[0].DebtReserve = DebtReserve;
    cashFlow[0].Depreciation = TotalCostOfPlant * DepreciationFraction;
    cashFlow[0].CapacityIncome = AnnualCapacityPayment;
    cashFlow[0].HeatSalesIncome = TotalIncomeFromHeatSales;
    cashFlow[0].InterestOnDebtReserve = AnnualDebtReserveInterest;
    cashFlow[0].TaxesWoCredit = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
        * (cashFlow[0].EquityPrincipalPaid + cashFlow[0].DebtPrincipalPaid + cashFlow[0].EquityInterest
            - cashFlow[0].Depreciation + DebtReserve);
    cashFlow[0].TaxCredit = AnnualNetGeneration * input.ProductionTaxCredit * input.TaxCreditFrac[0];
    cashFlow[0].Taxes = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
        * (cashFlow[0].EquityPrincipalPaid + cashFlow[0].DebtPrincipalPaid + cashFlow[0].EquityInterest
            - cashFlow[0].Depreciation + DebtReserve - cashFlow[0].TaxCredit);
    cashFlow[0].EnergyRevenueRequired = cashFlow[0].EquityRecovery + cashFlow[0].DebtRecovery
        + cashFlow[0].FuelCost + cashFlow[0].NonFuelExpenses + cashFlow[0].Taxes + DebtReserve
        - cashFlow[0].CapacityIncome - cashFlow[0].InterestOnDebtReserve - cashFlow[0].HeatSalesIncome;
    // Year 2 to the last second Year (19 in this case)
    for (let i = 1; i < input.EconomicLife - 1; i++) {
        cashFlow[i] = CalcCashFlow(cashFlow[i - 1], i + 1);
    }
    // Last Year (20 in this case)
    cashFlow[input.EconomicLife - 1] = CalcCashFlowLast(cashFlow[input.EconomicLife - 2], input.EconomicLife);

    function CalcCashFlow(CF: CashFlowCHP, Year: number) {
        const newCF: CashFlowCHP = { Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                     EquityPrincipalRemaining: 0, DebtRecovery: 0, DebtInterest: 0,
                                     DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, FuelCost: 0,
                                     NonFuelExpenses: 0, DebtReserve: 0, Depreciation: 0, CapacityIncome: 0,
                                     HeatSalesIncome: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0, TaxCredit: 0,
                                     Taxes: 0, EnergyRevenueRequired: 0 };
        newCF.Year = Year;
        newCF.EquityRecovery = AnnualEquityRecovery;
        newCF.EquityInterest = input.CostOfEquity / 100 * CF.EquityPrincipalRemaining;
        newCF.EquityPrincipalPaid = newCF.EquityRecovery - newCF.EquityInterest;
        newCF.EquityPrincipalRemaining = CF.EquityPrincipalRemaining - newCF.EquityPrincipalPaid;
        newCF.DebtRecovery = AnnualDebtPayment;
        newCF.DebtInterest = input.InterestRateOnDebt / 100 * CF.DebtPrincipalRemaining;
        newCF.DebtPrincipalPaid = newCF.DebtRecovery - newCF.DebtInterest;
        newCF.DebtPrincipalRemaining = CF.DebtPrincipalRemaining - newCF.DebtPrincipalPaid;
        newCF.FuelCost = AnnualFuelConsumption * input.FuelCost
            * Math.pow((1 + input.EscalationFuel / 100), (Year - 1));
        newCF.NonFuelExpenses = TotalNonFuelExpenses * Math.pow((1 + input.EscalationOther / 100), (Year - 1));
        newCF.DebtReserve = 0;
        newCF.Depreciation = TotalCostOfPlant * DepreciationFraction;
        newCF.CapacityIncome = AnnualCapacityPayment;
        newCF.HeatSalesIncome = TotalIncomeFromHeatSales * Math.pow((1 + input.EscalationHeatSales / 100), (Year - 1));
        newCF.InterestOnDebtReserve = AnnualDebtReserveInterest;
        newCF.TaxesWoCredit = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.EquityPrincipalPaid + newCF.DebtPrincipalPaid + newCF.EquityInterest
                - newCF.Depreciation + newCF.DebtReserve);
        newCF.TaxCredit = AnnualNetGeneration * input.ProductionTaxCredit
            * Math.pow((1 + input.EscalationForProductionTaxCredit / 100), (Year - 1)) * input.TaxCreditFrac[Year - 1];
        newCF.Taxes = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.EquityPrincipalPaid + newCF.DebtPrincipalPaid + newCF.EquityInterest
                - newCF.Depreciation + newCF.DebtReserve - newCF.TaxCredit);
        newCF.EnergyRevenueRequired = newCF.EquityRecovery + newCF.DebtRecovery + newCF.FuelCost
            + newCF.NonFuelExpenses + newCF.Taxes + newCF.DebtReserve - newCF.CapacityIncome
            - newCF.InterestOnDebtReserve - newCF.HeatSalesIncome;

        return newCF;
    }

    function CalcCashFlowLast(CF: CashFlowCHP, Year: number) { // DebtReserve is calculated differently
        const newCF: CashFlowCHP = { Year: 0, EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                     EquityPrincipalRemaining: 0, DebtRecovery: 0, DebtInterest: 0,
                                     DebtPrincipalPaid: 0, DebtPrincipalRemaining: 0, FuelCost: 0,
                                     NonFuelExpenses: 0, DebtReserve: 0, Depreciation: 0, CapacityIncome: 0,
                                     HeatSalesIncome: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0, TaxCredit: 0,
                                     Taxes: 0, EnergyRevenueRequired: 0 };
        newCF.Year = Year;
        newCF.EquityRecovery = AnnualEquityRecovery;
        newCF.EquityInterest = input.CostOfEquity / 100 * CF.EquityPrincipalRemaining;
        newCF.EquityPrincipalPaid = newCF.EquityRecovery - newCF.EquityInterest;
        newCF.EquityPrincipalRemaining = CF.EquityPrincipalRemaining - newCF.EquityPrincipalPaid;
        newCF.DebtRecovery = AnnualDebtPayment;
        newCF.DebtInterest = input.InterestRateOnDebt / 100 * CF.DebtPrincipalRemaining;
        newCF.DebtPrincipalPaid = newCF.DebtRecovery - newCF.DebtInterest;
        newCF.DebtPrincipalRemaining = CF.DebtPrincipalRemaining - newCF.DebtPrincipalPaid;
        newCF.FuelCost = AnnualFuelConsumption * input.FuelCost
            * Math.pow((1 + input.EscalationFuel / 100), (Year - 1));
        newCF.NonFuelExpenses = TotalNonFuelExpenses * Math.pow((1 + input.EscalationOther / 100), (Year - 1));
        newCF.DebtReserve = -DebtReserve;
        newCF.Depreciation = TotalCostOfPlant * DepreciationFraction;
        newCF.CapacityIncome = AnnualCapacityPayment;
        newCF.HeatSalesIncome = TotalIncomeFromHeatSales * Math.pow((1 + input.EscalationHeatSales / 100), (Year - 1));
        newCF.InterestOnDebtReserve = AnnualDebtReserveInterest;
        newCF.TaxesWoCredit = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.EquityPrincipalPaid + newCF.DebtPrincipalPaid + newCF.EquityInterest
                - newCF.Depreciation + newCF.DebtReserve);
        newCF.TaxCredit = AnnualNetGeneration * input.ProductionTaxCredit
            * Math.pow((1 + input.EscalationForProductionTaxCredit / 100), (Year - 1)) * input.TaxCreditFrac[Year - 1];
        newCF.Taxes = ((CombinedTaxRate / 100) / (1 - CombinedTaxRate / 100))
            * (newCF.EquityPrincipalPaid + newCF.DebtPrincipalPaid + newCF.EquityInterest
                - newCF.Depreciation + newCF.DebtReserve - newCF.TaxCredit);
        newCF.EnergyRevenueRequired = newCF.EquityRecovery + newCF.DebtRecovery + newCF.FuelCost
            + newCF.NonFuelExpenses + newCF.Taxes + newCF.DebtReserve - newCF.CapacityIncome
            - newCF.InterestOnDebtReserve - newCF.HeatSalesIncome;

        return newCF;
    }
    const Total: TotalCashFlowCHP = { EquityRecovery: 0, EquityInterest: 0, EquityPrincipalPaid: 0,
                                      DebtRecovery: 0, DebtInterest: 0, DebtPrincipalPaid: 0, FuelCost: 0,
                                      NonFuelExpenses: 0, DebtReserve: 0, Depreciation: 0, CapacityIncome: 0,
                                      HeatSalesIncome: 0, InterestOnDebtReserve: 0, TaxesWoCredit: 0, TaxCredit: 0,
                                      Taxes: 0, EnergyRevenueRequired: 0 };
    for (let i = 0; i < cashFlow.length; i++) {
        Total.EquityRecovery += cashFlow[i].EquityRecovery;
        Total.EquityInterest += cashFlow[i].EquityInterest;
        Total.EquityPrincipalPaid += cashFlow[i].EquityPrincipalPaid;
        Total.DebtRecovery += cashFlow[i].DebtRecovery;
        Total.DebtInterest += cashFlow[i].DebtInterest;
        Total.DebtPrincipalPaid += cashFlow[i].DebtPrincipalPaid;
        Total.FuelCost += cashFlow[i].FuelCost;
        Total.NonFuelExpenses += cashFlow[i].NonFuelExpenses;
        Total.DebtReserve += cashFlow[i].DebtReserve;
        Total.Depreciation += cashFlow[i].Depreciation;
        Total.CapacityIncome += cashFlow[i].CapacityIncome;
        Total.HeatSalesIncome += cashFlow[i].HeatSalesIncome;
        Total.InterestOnDebtReserve += cashFlow[i].InterestOnDebtReserve;
        Total.TaxesWoCredit += cashFlow[i].TaxesWoCredit;
        Total.TaxCredit += cashFlow[i].TaxCredit;
        Total.Taxes += cashFlow[i].Taxes;
        Total.EnergyRevenueRequired += cashFlow[i].EnergyRevenueRequired;
    }
    // Current $ Level Annual Cost (LAC)
    const PresentWorth = [];
    let TotalPresentWorth = 0;
    for (let i = 0; i < cashFlow.length; i++) {
        const newPW = PW(cashFlow[i].EnergyRevenueRequired, input.CostOfEquity, i + 1);
        PresentWorth.push(newPW);
        TotalPresentWorth += newPW;
    }
    const CapitalRecoveryFactorCurrent = CapitalRecoveryFactorEquity;
    const CurrentLevelAnnualRevenueRequirements = CapitalRecoveryFactorCurrent * TotalPresentWorth;
    const CurrentLACofEnergy = CurrentLevelAnnualRevenueRequirements / AnnualNetGeneration;
    function PW(EnergyRevenueRequired: number, CostOfEquity: number, Year: number) {
        return EnergyRevenueRequired * Math.pow((1 + CostOfEquity / 100), -Year);
    }
    const RealCostOfMoney = (1 + input.CostOfEquity / 100) / (1 + input.GeneralInflation / 100) - 1;
    const CapitalRecoveryFactorConstant = CapitalRecoveryFactor(RealCostOfMoney * 100, input.EconomicLife);
    const ConstantLevelAnnualRevenueRequirements = TotalPresentWorth * CapitalRecoveryFactorConstant;
    const ConstantLACofEnergy = ConstantLevelAnnualRevenueRequirements / AnnualNetGeneration;

    return {
            'AnnualCashFlows': cashFlow,
            'TotalCashFlow': Total,
            'TotalPresentWorth': TotalPresentWorth,
            'CurrentLevelAnnualRevenueRequirements': CurrentLevelAnnualRevenueRequirements,
            'ConstantLevelAnnualRevenueRequirements': ConstantLevelAnnualRevenueRequirements,
            'CurrentLACofEnergy': CurrentLACofEnergy,
            'ConstantLACofEnergy': ConstantLACofEnergy
            };
}

export { GenericCombinedHeatPower };
