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

        // Retrieve the created from transaction type and ID
        var createdFromType = newRecord.getValue({
            fieldId: 'createdfromtype'
        });

        var createdFromId = newRecord.getValue({
            fieldId: 'createdfrom'
        });

        // Check if the created from transaction is a Transfer Order
        if (createdFromType !== 'SalesOrd') {
            log.debug('Item Receipt created from a transaction other than Transfer Order, exiting script.');
            return;
        }

        // Load the Transfer Order record
        var transferOrder = record.load({
            type: record.Type.TrnfrOrd,
            id: createdFromId,
            isDynamic: false
        });

        // Retrieve the to location from the Transfer Order
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

