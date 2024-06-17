/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/log', 'N/search'], function(record, log, search) {

    function beforeLoad(context) {
        // Check if the script is running before the record is loaded
        if (context.type !== context.UserEventType.CREATE) {
            return;
        }

        log.debug('Script Started');
        var newRecord = context.newRecord;

        // Check if the record type is Item Receipt
        if (newRecord.type !== record.Type.ITEM_RECEIPT) {
            return;
        }

        // Retrieve the transfer order reference from the Item Receipt
        var transferOrderId = newRecord.getValue({
            fieldId: 'createdfrom'
        });

        // If there's no transfer order reference, exit the script
        if (!transferOrderId) {
            log.debug('No transfer order reference found, exiting script.');
            return;
        }

        // Load the Transfer Order record
        var transferOrder = record.load({
            type: record.Type.TRANSFER_ORDER,
            id: transferOrderId,
            isDynamic: false
        });

        // Retrieve the from location from the Transfer Order
        var toLocationId = transferOrder.getValue({
            fieldId: 'transferlocation'
        });

        // Set the to location on the Item Receipt with the to location from the Transfer Order
        newRecord.setValue({
            fieldId: 'location',
            value: toLocationId
        });

        log.debug('Item Receipt updated with to location from Transfer Order.');
        log.debug('Script Ended');
    }

    return {
        beforeLoad: beforeLoad
    };

});
