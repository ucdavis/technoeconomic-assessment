// GenericPowerOnly
export interface InputModGPO {
  CapitalCost: number;
  // Electrical and Fuel--base year
  ElectricalFuelBaseYear: ElectricalFuelBaseYearInputModGPO;
  // Expenses--base year
  ExpensesBaseYear: ExpensesBaseYearInputModGPO;
  // Taxes
  Taxes: TaxesInputMod;
  // Financing
  Financing: FinancingInputMod;
  // Income other than energy
  IncomeOtherThanEnergy: IncomeOtherThanEnergyInputMod;
  // Escalation/Inflation
  EscalationInflation: EscalationInflationInputMod;
  // Tax Credit Schedule
  TaxCreditFrac: number[];
  CarbonCredit: CarbonCredit;
  IncludeCarbonCredit: boolean;
  FirstYear: number;
}

export interface CarbonCredit {
  CreditPrice: number; // $/tonne
  CIscore: number; // Carbon Intensity score (gCO2e/MJ)
  // Distance an alternative-fueled vehicle travels
  // divided by the distance an internal combustion engine vehicle travels
  // using the same amount of energy.
  EnergyEconomyRatio: number;
}

// GenericCombinedHeatPower
export interface InputModCHP {
  CapitalCost: number;
  // Electrical and Fuel--base year
  ElectricalFuelBaseYear: ElectricalFuelBaseYearInputModCHP;
  // Heat-base year
  HeatBaseYear: HeatBaseYearInputMod;
  // Expenses--base year
  ExpensesBaseYear: ExpensesBaseYearInputModGPO;
  // Taxes
  Taxes: TaxesInputMod;
  // Financing
  Financing: FinancingInputMod;
  // Income other than energy
  IncomeOtherThanEnergy: IncomeOtherThanEnergyInputMod;
  // Escalation/Inflation
  EscalationInflation: EscalationInflationInputMod;
  // Tax Credit Schedule
  TaxCreditFrac: number[];
  CarbonCredit: CarbonCredit;
  IncludeCarbonCredit: boolean;
  FirstYear: number;
}

// GasificationPower
export interface InputModGP {
  // Capital Cost from Gasification Power Generation
  CapitalCost: number;
  // Electrical and Fuel -- base year from Gasification Power Generation
  ElectricalFuelBaseYear: ElectricalFuelBaseYearInputModGP;
  // Heat--Base Year
  HeatBaseYear: HeatBaseYearInputMod;
  // Expenses--Base Year
  ExpensesBaseYear: ExpensesBaseYearInputModGP;
  // Taxes
  Taxes: TaxesInputMod;
  // Financing
  Financing: FinancingInputMod;
  // Income Other Than Energy
  IncomeOtherThanEnergy: IncomeOtherThanEnergyInputModGP;
  // Escalation/Inflation
  EscalationInflation: EscalationInflationInputModGP;
  // Tax Rate Schedule
  TaxCreditFrac: number[];
  CarbonCredit: CarbonCredit;
  IncludeCarbonCredit: boolean;
  FirstYear: number;
}

// Sensitivity Analysis
export interface InputModSensitivity {
  model: string;
  input: any;
  CapitalCost: {
    high: number;
    low: number;
  };
  BiomassFuelCost: {
    high: number;
    low: number;
  };
  DebtRatio: {
    high: number;
    low: number;
  };
  DebtInterestRate: {
    high: number;
    low: number;
  };
  CostOfEquity: {
    high: number;
    low: number;
  };
  NetStationEfficiency: {
    high: number;
    low: number;
  };
  CapacityFactor: {
    high: number;
    low: number;
  };
}

// Hydrogen
export interface InputModHydrogen {
  // Hydrogen Generation
  GrossDesignHydrogenCapacity: number;
  Feedstock: number;
  OverallProductionEfficiency: number;
  CapacityFactor: number;
  // Capital Cost
  CapitalCost: number;
  // Expenses--base year
  FeedstockCost: number;
  OperatingExpensesRate: number;
  // Other Revenues or Cost Savings
  ElectricalEnergy: number;
  IncentivePayments: number;
  Capacity: number;
  Heat: number;
  Residues: number;
  // Taxes and Tax credit
  FederalTaxRate: number;
  StateTaxRate: number;
  ProductionTaxCredit: number;
  NegativeTaxesOffset: boolean;
  // Escalation/Inflation
  GeneralInflation: number;
  EscalationFeedstock: number;
  EscalationElectricalEnergy: number;
  EscalationIncentivePayments: number;
  EscalationCapacityPayment: number;
  EscalationProductionTaxCredit: number;
  EscalationHeatSales: number;
  EscalationResidueSales: number;
  EscalationOther: number;
  // Financing
  DebtRatio: number;
  InterestRateOnDebt: number;
  OneYearDebtReserveRequired: boolean;
  MARR: number;
  EconomicLife: number;
  InterestRateOnDebtReserve: number;
  // Tax Credit Schedule
  TaxCreditFrac: number[];
}

export interface ElectricalFuelBaseYearInputMod {
  NetElectricalCapacity: number;
  CapacityFactor: number;
  MoistureContent: number;
  NetStationEfficiency: number;
}
export interface ElectricalFuelBaseYearInputModGPO
  extends ElectricalFuelBaseYearInputMod {
  FuelHeatingValue: number;
  FuelAshConcentration: number;
}
export interface ElectricalFuelBaseYearInputModCHP
  extends ElectricalFuelBaseYearInputModGPO {
  GrossElectricalCapacity: number;
}
export interface ElectricalFuelBaseYearInputModGP
  extends ElectricalFuelBaseYearInputMod {
  GrossElectricalCapacity: number;
  HHVEfficiency: number;
  // NetHHVEfficiency: number;
  FractionOfInputEnergy: number; // Dual Fuel if ant, default set to heavy disele
  CO: number;
  H2: number;
  Hydrocarbons: number;
  CO2: number;
  O2: number;
  HHV: number; // Higher Heating Value of Biomass Feedstock to Gasifier (kJ/kg)
  AshContent: number;
  CarbonConcentration: number;
}

export interface ExpensesBaseYearInputMod {
  BiomassFuelCost: number; // FuelCost for GPO and CHP on spreadsheet
  LaborCost: number;
  MaintenanceCost: number;
  InsurancePropertyTax: number;
  Utilities: number;
  Management: number;
  OtherOperatingExpenses: number;
}
export interface ExpensesBaseYearInputModGPO extends ExpensesBaseYearInputMod {
  AshDisposal: number;
}
export interface ExpensesBaseYearInputModGP extends ExpensesBaseYearInputMod {
  DualFuelCost: number;
  WasteTreatment: number;
}

export interface HeatBaseYearInputMod {
  AggregateFractionOfHeatRecovered: number;
  AggregateSalesPriceForHeat: number;
}

export interface TaxesInputMod {
  FederalTaxRate: number;
  StateTaxRate: number;
  ProductionTaxCredit: number;
}

export interface FinancingInputMod {
  DebtRatio: number;
  InterestRateOnDebt: number;
  EconomicLife: number;
  CostOfEquity: number;
}

export interface IncomeOtherThanEnergyInputMod {
  CapacityPayment: number;
  InterestRateOnDebtReserve: number;
}
export interface IncomeOtherThanEnergyInputModGP
  extends IncomeOtherThanEnergyInputMod {
  SalesPriceForChar: number;
}

export interface EscalationInflationInputMod {
  GeneralInflation: number;
  EscalationBiomassFuel: number; // for GPO and CHP this is just EscalationFuel on the spreadsheet
  EscalationProductionTaxCredit: number;
  EscalationHeatSales: number;
  EscalationOther: number;
}
export interface EscalationInflationInputModGP
  extends EscalationInflationInputMod {
  EscalationDualFuel: number;
  EscalationCharSales: number;
}

// Transmission
export interface InputModTransimission {
  VoltageClass: string;
  ConductorType: string;
  Structure: string;
  LengthCategory: string;
  NewOrReconductor: string;
  AverageTerrainMultiplier: number;
  Miles: {
    Forested: number;
    Flat: number;
    Wetland: number;
    Farmland: number;
    Desert: number;
    Urban: number;
    Hills: number;
    Mountain: number;
    Zone1: number;
    Zone2: number;
    Zone3: number;
    Zone4: number;
    Zone5: number;
    Zone6: number;
    Zone7: number;
    Zone8: number;
    Zone9: number;
    Zone10: number;
    Zone11: number;
    Zone12: number;
  };
}

// Substation
export interface InputModSubstation {
  Voltage: string;
  NewOrExisting: string;
  CircuitBreakerType: string;
  NoLineXFMRPositions: number;
  HVDCconverter: string;
  TransformerType: string;
  MVAratingPerTransformer: number;
  NoTransformers: number;
  SVCmvarRating: number;
  ShuntReactorMVARrating: number;
  SeriesCapacitorMVARrating: number;
}
