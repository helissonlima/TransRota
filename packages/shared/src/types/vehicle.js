"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelType = exports.VehicleStatus = exports.VehicleType = void 0;
var VehicleType;
(function (VehicleType) {
    VehicleType["TRUCK"] = "TRUCK";
    VehicleType["VAN"] = "VAN";
    VehicleType["MOTORCYCLE"] = "MOTORCYCLE";
    VehicleType["CAR"] = "CAR";
    VehicleType["UTILITY"] = "UTILITY";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["ACTIVE"] = "ACTIVE";
    VehicleStatus["MAINTENANCE"] = "MAINTENANCE";
    VehicleStatus["INACTIVE"] = "INACTIVE";
})(VehicleStatus || (exports.VehicleStatus = VehicleStatus = {}));
var FuelType;
(function (FuelType) {
    FuelType["GASOLINE"] = "GASOLINE";
    FuelType["ETHANOL"] = "ETHANOL";
    FuelType["DIESEL"] = "DIESEL";
    FuelType["GNV"] = "GNV";
    FuelType["ELECTRIC"] = "ELECTRIC";
    FuelType["FLEX"] = "FLEX";
})(FuelType || (exports.FuelType = FuelType = {}));
//# sourceMappingURL=vehicle.js.map