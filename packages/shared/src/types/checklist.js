"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistItemStatus = exports.ChecklistType = void 0;
var ChecklistType;
(function (ChecklistType) {
    ChecklistType["PRE_TRIP"] = "PRE_TRIP";
    ChecklistType["POST_TRIP"] = "POST_TRIP";
    ChecklistType["MAINTENANCE"] = "MAINTENANCE";
})(ChecklistType || (exports.ChecklistType = ChecklistType = {}));
var ChecklistItemStatus;
(function (ChecklistItemStatus) {
    ChecklistItemStatus["OK"] = "OK";
    ChecklistItemStatus["NOK"] = "NOK";
    ChecklistItemStatus["NA"] = "NA";
})(ChecklistItemStatus || (exports.ChecklistItemStatus = ChecklistItemStatus = {}));
//# sourceMappingURL=checklist.js.map