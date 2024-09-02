# NetSuite-ItemReceiptLocationFix
With the default way that NetSuite is set up, the to and from locations on an item receipt are labeled wrong. An easy fix for this would be to simply relabel the fields yourself, but for some companies, ours included, there is already scripting and workflows that rely on these fields set in place the way they have been. This primarily is an issue for item receipts of transfer orders, where the to and from locations are the wrong way around.

This script fixes the issue of the item receipt record from a transfer order being created with the wrong information.
