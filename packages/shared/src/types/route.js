"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonDeliveryReason = exports.StopStatus = exports.RouteStatus = void 0;
var RouteStatus;
(function (RouteStatus) {
    RouteStatus["DRAFT"] = "DRAFT";
    RouteStatus["SCHEDULED"] = "SCHEDULED";
    RouteStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RouteStatus["COMPLETED"] = "COMPLETED";
    RouteStatus["CANCELLED"] = "CANCELLED";
})(RouteStatus || (exports.RouteStatus = RouteStatus = {}));
var StopStatus;
(function (StopStatus) {
    StopStatus["PENDING"] = "PENDING";
    StopStatus["IN_TRANSIT"] = "IN_TRANSIT";
    StopStatus["DELIVERED"] = "DELIVERED";
    StopStatus["PARTIAL_DELIVERY"] = "PARTIAL_DELIVERY";
    StopStatus["NOT_DELIVERED"] = "NOT_DELIVERED";
    StopStatus["RESCHEDULED"] = "RESCHEDULED";
})(StopStatus || (exports.StopStatus = StopStatus = {}));
var NonDeliveryReason;
(function (NonDeliveryReason) {
    NonDeliveryReason["ABSENT_RECIPIENT"] = "ABSENT_RECIPIENT";
    NonDeliveryReason["REFUSED"] = "REFUSED";
    NonDeliveryReason["WRONG_ADDRESS"] = "WRONG_ADDRESS";
    NonDeliveryReason["DAMAGED_GOODS"] = "DAMAGED_GOODS";
    NonDeliveryReason["SECURITY"] = "SECURITY";
    NonDeliveryReason["OTHER"] = "OTHER";
})(NonDeliveryReason || (exports.NonDeliveryReason = NonDeliveryReason = {}));
//# sourceMappingURL=route.js.map