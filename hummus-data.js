// EVCalc.io - Vehicle Data & Constants
// Real-world EV data for comparison tools

const EVData = {
    // Popular EV models with real specs
    vehicles: [
        {
            id: 'tesla-model-3',
            name: 'Tesla Model 3',
            manufacturer: 'Tesla',
            year: 2024,
            msrp: 40380,
            efficiency: 4.1, // mi/kWh (EPA combined)
            range: 272,
            batterySize: 66, // kWh
            category: 'sedan',
            taxCredit: 7500,
            image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400'
        },
        {
            id: 'tesla-model-y',
            name: 'Tesla Model Y',
            manufacturer: 'Tesla',
            year: 2024,
            msrp: 47740,
            efficiency: 3.5,
            range: 260,
            batterySize: 75,
            category: 'suv',
            taxCredit: 7500,
            image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400'
        },
        {
            id: 'chevrolet-bolt-ev',
            name: 'Chevrolet Bolt EV',
            manufacturer: 'Chevrolet',
            year: 2024,
            msrp: 26500,
            efficiency: 3.8,
            range: 259,
            batterySize: 66,
            category: 'hatchback',
            taxCredit: 7500,
            image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400'
        },
        {
            id: 'ford-mustang-mach-e',
            name: 'Ford Mustang Mach-E',
            manufacturer: 'Ford',
            year: 2024,
            msrp: 42995,
            efficiency: 3.0,
            range: 250,
            batterySize: 70,
            category: 'suv',
            taxCredit: 7500,
            image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400'
        },
        {
            id: 'hyundai-ioniq-5',
            name: 'Hyundai Ioniq 5',
            manufacturer: 'Hyundai',
            year: 2024,
            msrp: 41800,
            efficiency: 3.4,
            range: 266,
            batterySize: 77.4,
            category: 'suv',
            taxCredit: 0, // Not eligible (assembled in Korea)
            image: 'https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=400'
        },
        {
            id: 'volkswagen-id4',
            name: 'Volkswagen ID.4',
            manufacturer: 'Volkswagen',
            year: 2024,
            msrp: 38995,
            efficiency: 3.3,
            range: 260,
            batterySize: 77,
            category: 'suv',
            taxCredit: 7500,
            image: 'https://images.unsplash.com/photo-1617886322207-676baff86f6c?w=400'
        },
        {
            id: 'rivian-r1t',
            name: 'Rivian R1T',
            manufacturer: 'Rivian',
            year: 2024,
            msrp: 69900,
            efficiency: 2.1,
            range: 270,
            batterySize: 128,
            category: 'truck',
            taxCredit: 0, // Over MSRP limit
            image: 'https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=400'
        },
        {
            id: 'ford-f150-lightning',
            name: 'Ford F-150 Lightning',
            manufacturer: 'Ford',
            year: 2024,
            msrp: 49995,
            efficiency: 2.1,
            range: 240,
            batterySize: 98,
            category: 'truck',
            taxCredit: 7500,
            image: 'https://images.unsplash.com/photo-1623520527779-c4ef05e5b5f3?w=400'
        }
    ],
    
    // Gas comparison vehicles
    gasVehicles: [
        {
            id: 'toyota-camry',
            name: 'Toyota Camry',
            category: 'sedan',
            msrp: 26420,
            mpg: 32, // combined
            tankSize: 14.3,
            annualMaintenance: 550
        },
        {
            id: 'honda-crv',
            name: 'Honda CR-V',
            category: 'suv',
            msrp: 30800,
            mpg: 29,
            tankSize: 14.0,
            annualMaintenance: 650
        },
        {
            id: 'ford-f150',
            name: 'Ford F-150',
            category: 'truck',
            msrp: 37985,
            mpg: 22,
            tankSize: 23.0,
            annualMaintenance: 750
        }
    ],
    
    // National averages and constants
    defaults: {
        electricityRate: 0.14, // $/kWh (US average)
        gasPrice: 3.50, // $/gallon (2024 average)
        annualMiles: 12000,
        evMaintenanceCostPerMile: 0.06,
        gasMaintenanceCostPerMile: 0.10,
        insuranceMultiplier: 1.15, // EVs typically 15% higher
        chargerCost: 800, // Level 2 charger equipment
        installationCost: 1500, // Average installation
        discountRate: 0.03 // For NPV calculations
    },
    
    // State-specific data
    states: {
        'CA': { electricityRate: 0.23, gasPrice: 4.20, incentive: 7500 },
        'NY': { electricityRate: 0.18, gasPrice: 3.80, incentive: 2000 },
        'TX': { electricityRate: 0.11, gasPrice: 3.20, incentive: 0 },
        'FL': { electricityRate: 0.12, gasPrice: 3.40, incentive: 0 },
        'WA': { electricityRate: 0.10, gasPrice: 4.00, incentive: 0 },
        'CO': { electricityRate: 0.13, gasPrice: 3.50, incentive: 5000 },
        'MA': { electricityRate: 0.22, gasPrice: 3.70, incentive: 3500 },
        'OR': { electricityRate: 0.11, gasPrice: 3.90, incentive: 2500 }
    },
    
    // Affiliate links (Amazon Associates)
    affiliates: {
        chargers: [
            {
                name: 'ChargePoint Home Flex',
                price: 699,
                rating: 4.6,
                link: 'https://amzn.to/PLACEHOLDER',
                features: ['Up to 50A', 'WiFi enabled', '23ft cable']
            },
            {
                name: 'Emporia EV Charger',
                price: 449,
                rating: 4.5,
                link: 'https://amzn.to/PLACEHOLDER',
                features: ['Smart charging', 'Energy monitoring', 'Alexa compatible']
            },
            {
                name: 'Grizzl-E Classic',
                price: 399,
                rating: 4.7,
                link: 'https://amzn.to/PLACEHOLDER',
                features: ['40A', 'Weatherproof', 'Budget-friendly']
            }
        ],
        accessories: [
            {
                name: 'NEMA 14-50 Outlet',
                price: 25,
                link: 'https://amzn.to/PLACEHOLDER'
            }
        ]
    }
};

// Calculation utilities
const EVCalc = {
    // Calculate annual fuel cost for EV
    evAnnualFuelCost(miles, efficiency, electricityRate) {
        const kwhUsed = miles / efficiency;
        return kwhUsed * electricityRate;
    },
    
    // Calculate annual fuel cost for gas vehicle
    gasAnnualFuelCost(miles, mpg, gasPrice) {
        const gallonsUsed = miles / mpg;
        return gallonsUsed * gasPrice;
    },
    
    // Calculate payback period for home charger
    chargerPayback(dailyMiles, efficiency, electricityRate, gasMpg, gasPrice, chargerCost, installationCost) {
        const annualMiles = dailyMiles * 365;
        const evCost = this.evAnnualFuelCost(annualMiles, efficiency, electricityRate);
        const gasCost = this.gasAnnualFuelCost(annualMiles, gasMpg, gasPrice);
        const annualSavings = gasCost - evCost;
        const totalInvestment = chargerCost + installationCost;
        
        if (annualSavings <= 0) return null;
        return totalInvestment / annualSavings;
    },
    
    // Calculate 5-year TCO comparison
    tco5Year(evPrice, evEfficiency, gasPrice, gasMpg, electricityRate, miles, evTaxCredit = 0, stateIncentive = 0) {
        const years = 5;
        const totalMiles = miles * years;
        
        // EV costs
        const evFuelCost = this.evAnnualFuelCost(totalMiles, evEfficiency, electricityRate);
        const evMaintenanceCost = totalMiles * EVData.defaults.evMaintenanceCostPerMile;
        const evInsurance = 1200 * years * EVData.defaults.insuranceMultiplier;
        const evTotalCost = evPrice - evTaxCredit - stateIncentive + evFuelCost + evMaintenanceCost + evInsurance;
        
        // Gas costs
        const gasFuelCost = this.gasAnnualFuelCost(totalMiles, gasMpg, gasPrice);
        const gasMaintenanceCost = totalMiles * EVData.defaults.gasMaintenanceCostPerMile;
        const gasInsurance = 1200 * years;
        const gasTotalCost = gasPrice + gasFuelCost + gasMaintenanceCost + gasInsurance;
        
        return {
            ev: {
                purchase: evPrice - evTaxCredit - stateIncentive,
                fuel: evFuelCost,
                maintenance: evMaintenanceCost,
                insurance: evInsurance,
                total: evTotalCost
            },
            gas: {
                purchase: gasPrice,
                fuel: gasFuelCost,
                maintenance: gasMaintenanceCost,
                insurance: gasInsurance,
                total: gasTotalCost
            },
            savings: gasTotalCost - evTotalCost
        };
    },
    
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },
    
    // Format number with commas
    formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(Math.round(num));
    }
};

// Export for use in calculators
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EVData, EVCalc };
}
