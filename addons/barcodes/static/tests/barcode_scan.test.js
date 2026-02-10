/** @betopiaerp-module **/

import { expect, test } from "@betopiaerp/hoot";
import { waitFor } from "@betopiaerp/hoot-dom";
import { Component, xml } from "@betopiaerp/owl";
import { BarcodeScanner } from "@barcodes/components/barcode_scanner";
import { contains, mountWithCleanup } from "@web/../tests/web_test_helpers";

test.tags("desktop");
test("Display notification for media device permission on barcode scanning", async () => {
    navigator.mediaDevices.getUserMedia = function () {
        return Promise.reject(new DOMException("", "NotAllowedError"));
    };

    class BarcodeScan extends Component {
        static template = xml`
            <div>
                <BarcodeScanner onBarcodeScanned="(ev) => this.onBarcodeScanned(ev)"/>
            </div>
        `;
        static components = { BarcodeScanner };
        static props = ["*"];
    }

    await mountWithCleanup(BarcodeScan);
    await contains("a.o_mobile_barcode").click();
    await waitFor(".modal-body:contains(camera)");
    expect(".modal-body").toHaveText(
        "Unable to access camera\nCould not start scanning. BetopiaERP needs your authorization first."
    );
});
