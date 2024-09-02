/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/log', 'N/search'], function(record, log, search) {

    function beforeLoad(context) {
        log.debug('Script Check');
        // Check if the script is running before the record is loaded
        if (context.type !== context.UserEventType.CREATE) {
            log.debug('Event type is not Create');
            return;
        }

        log.debug('Script Started');
        var newRecord = context.newRecord;

        // Check if the record type is Item Receipt
        if (newRecord.type !== record.Type.ITEM_RECEIPT) {
            return;
        }

        // Retrieve the created from transaction ID
        var createdFromId = newRecord.getValue({
            fieldId: 'createdfrom'
        });

        if (!createdFromId) {
            log.debug('No created from transaction found, exiting script.');
            return;
        }

        // Use a search to determine the type of the created from record
        var transactionSearch = search.create({
            type: search.Type.TRANSACTION,
            filters: [
                ['internalid', 'is', createdFromId]
            ],
            columns: ['type']
        });

        var transactionType;
        transactionSearch.run().each(function(result) {
            transactionType = result.getValue('type');
            return false; // We only need the first result
        });

        // Check if the created from transaction is a Transfer Order
        if (transactionType !== 'TrnfrOrd' / 'TRANSFER_ORDER') {
            log.debug('Wrong Transaction Type', 'Item Receipt created from a transaction other than Transfer Order, exiting script. Actual type: ' + transactionType);
            return;
        }

        // Load the created from record
        var createdFromRecord = record.load({
            type: record.Type.TRANSFER_ORDER,
            id: createdFromId,
            isDynamic: false
        });

        // Retrieve the to location from the Transfer Order
        var toLocationId = createdFromRecord.getValue({
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