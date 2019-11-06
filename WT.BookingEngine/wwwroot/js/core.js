$(document).ready(function () {
    console.log("ready!");
    LoadHotelData();
    LoadOrgIdData();
    TransparentEconomyCheck();
});

function LoadHotelData() {
    $.ajax({
        url: "data/hotel-wt.json", //"https://api.siesta.cloud/wt/8/description", //
        type: 'GET',
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            RenderHotelData(data);
        },
        error: function (error) {
        }
    });
};

function TransparentEconomyCheck() {

    var totalTransactions = 0;
    var outgoing = 0;
    var incoming = 0;
    var overHundered = false;
    var subtransTrans = [];

    var hotelAddress = '0xbf0dB1A4951C134E170E21A7CC3a1BB856a0e16C';
    $.ajax({
        url: "https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=" + hotelAddress + "&startblock=0&endblock=99999999&sort=asc&apikey=xxxxxxx",
        type: 'GET',
        dataType: "json",
        success: function (data) {
            console.log("transactions:", data);

            $.each(data.result, function (key, trans) {
                totalTransactions++;
                //console.log("trans.from:", trans.from);
                //console.log("hotelAddress", hotelAddress);
                if (trans.from.toLowerCase() == hotelAddress.toLowerCase()) {

                    outgoing++;
                }
                if (trans.to.toLowerCase() == hotelAddress.toLowerCase()) {
                    incoming++;
                }

                if (key == 100) {
                    overHundered = true;
                    // Take only 100 transactions
                    return false;
                }
            });

            console.log("totalTransactions:", totalTransactions);
            console.log("outgoing:", outgoing);
            console.log("incoming:", incoming);

            if (overHundered == false) {
                $(".transparent-economy-index").append("<div class='info'>Total Tx: <strong>" + totalTransactions + "</strong></div>");
            } else {
                $(".transparent-economy-index").append("<div class='info'>Total Tx: <strong>" + totalTransactions + " + </strong></div>");
            }
            $(".transparent-economy-index").append("<div class='info'>Out Tx: <strong>" + outgoing + "</strong></div>");
            $(".transparent-economy-index").append("<div class='info'>In Tx: <strong>" + incoming + "</strong></div>");

            //$.each(data.result, function (key, trans) {

            //    var address;

            //    if (trans.from.toLowerCase() == hotelAddress.toLowerCase()) {

            //        address = trans.to;
            //    }
            //    if (trans.to.toLowerCase() == hotelAddress.toLowerCase()) {
            //        address = trans.from;
            //    }

            //    var totalSubtrans = 0;

            //    $.ajax({
            //        url: "https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=" + address + "&startblock=0&endblock=99999999&sort=asc&apikey=xxxxx",
            //        type: 'GET',
            //        dataType: "json",
            //        success: function (transData) {

                        
            //            $.each(transData.result, function (subKey, subTrans) {

            //                totalSubtrans++;

            //                if (subKey == 100) {
                    
            //                    // Take only 100 transactions
            //                    return false;
            //                }
            //            });
            //            subtransTrans.push(totalSubtrans);
            //        },
            //        error: function (error) {
            //        }
            //    });

            //    if (key == 100) {
            //        // Take only 100 transactions
            //        return false;
            //    }
            //});

            console.log("subtransTrans", subtransTrans);
        },
        error: function (error) {
        }
    });
}

function LoadOrgIdData(publicKey) {
    $.ajax({
        url: "https://explorer-cache.myorgid.com/organizations/0xd5DED84534e0eedb53b3ecA32c14BA674C44daDB",
        type: 'GET',
        dataType: "json",
        success: function (data) {
            RenderOrgIdData(data);
        },
        error: function (error) {
        }
    });



};

function RenderOrgIdData(data) {

    // Org Id Info
    $(".org-info-card").append("<div class='info'>" + data.name + "</div>");
    $(".org-info-card").append("<div class='info'>" + data.address + "</div>");
    $(".org-info-card").append("<div class='info'>" + data.orgJsonUri + "</div>");
};

function RenderHotelData(data) {

    // Hotel Info
    var hotelNameElement = $("<div class='name'>" + data.name + "</div>");
    var hotelLocationElement = $("<div class='location'>" + data.address.city + ", " + data.address.countryCode + ", " + data.address.road + "</div>");
    $(".hotel-info").append(hotelNameElement);
    $(".hotel-info").append(hotelLocationElement);

    // Hotel Rooms
    $.each(data.roomTypes, function (key, roomType) {
        var roomTypeElement = $("<div class='hotel-roomtype-list-item'></div>");
        var roomTypeImage = $("<div class='image'><img src='" + roomType.images[4] + "' /></div>");
        var roomTypeInfo = $("<div class='info'></div>");
        var roomTypeName = $("<div class='name'>" + roomType.name + "</div>");
        var bookingButton = $('<button type="button" class="btn btn-info booking-btn" >Book now</button>');

        $(roomTypeElement).append(roomTypeImage);
        $(roomTypeElement).append(roomTypeInfo);
        $(roomTypeInfo).append(roomTypeName);
        $(roomTypeInfo).append(bookingButton);
        $(".hotel-rooms").append(roomTypeElement);


        $(bookingButton).click(function () {
            SelectRoom(roomType);
        });
    });
};

function SelectRoom(roomType) {
    console.log(roomType);
    $(".hotel-rooms").remove();
    $(".hotel-booking").show();
    var roomTypeElement = $("<div class='hotel-roomtype-list-item'></div>");
    var roomTypeImage = $("<div class='image'><img src='" + roomType.images[4] + "' /></div>");
    var roomTypeInfo = $("<div class='info'></div>");
    var roomTypeName = $("<div class='name'>" + roomType.name + "</div>");
    $(roomTypeElement).append(roomTypeImage);
    $(roomTypeElement).append(roomTypeInfo);
    $(roomTypeInfo).append(roomTypeName);
    $(".hotel-booking-roomtype").append(roomTypeElement);

    $(".booking-submit-btn").click(function () {
        SendBooking(roomType);
    });
};

var reservation = {};

function SendBooking(roomType) {
    reservation.firstName = $("#first-name").val();
    reservation.lastName = $("#last-name").val();
    reservation.email = $("#email").val();
    DisplayLoader();
    $(".hotel-booking").remove();
    $.ajax({
        url: "https://wt-hotel-api.azurewebsites.net/api/booking",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            firstName: reservation.firstName,
            lastName: reservation.lastName,
            email: reservation.email
        }),
        success: function (data) {
            reservation.paymentAddress = data.address;
            reservation.price = data.price;
            reservation.reservationId = data.id;
            StartPayment(roomType);
        },
        error: function (error) {

        }
    });
}

function StartPayment(roomType) {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({
                to: reservation.paymentAddress,
                value: web3.toWei(reservation.price, 'ether'),
                data: web3.toHex(reservation.reservationId),
                gas: 1000000
            }, (err, transactionId) => {
                if (err) {
                    console.log('Payment failed', err);
                    $('#status').html('Payment failed');
                } else {
                    reservation.transactionId = transactionId;
                    CheckBookingConfirmation(roomType);
                    console.log('Payment successful', transactionId);
                    $('#status').html('Payment successful');
                }
            });
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({
            to: reservation.paymentAddress,
            value: web3.toWei(reservation.price, 'ether'),
            data: web3.toHex(reservation.reservationId),
            gas: 1000000
        }, (err, transactionId) => {
            if (err) {
                console.log('Payment failed', err);
                $('#status').html('Payment failed');
            } else {
                reservation.transactionId = transactionId;
                CheckBookingConfirmation(roomType);
                console.log('Payment successful', transactionId);
                $('#status').html('Payment successful');
            }
        });
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

}

function CheckBookingConfirmation(roomType) {

    console.log("payment check");
    setTimeout(function () {
        $.ajax({
            url: "https://wt-hotel-api.azurewebsites.net/api/booking/" + reservation.reservationId,
            type: 'GET',
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                if (data.status == "confirmed") {
                    DisplayBookingConfirmation(roomType);
                } else {
                    CheckBookingConfirmation(roomType);
                }

            },
            error: function (error) {
                console.log("error");

            }
        });
    }, 100);

}

function DisplayBookingConfirmation(roomType) {
    DisplayLoader();
    $(".hotel-booking").remove();
    $(".booking-confirmation").show();
    var roomTypeElement = $("<div class='hotel-roomtype-list-item'></div>");
    var roomTypeImage = $("<div class='image'><img src='" + roomType.images[4] + "' /></div>");
    var roomTypeInfo = $("<div class='info'></div>");
    var roomTypeName = $("<div class='name'>" + roomType.name + "</div>");
    $(roomTypeElement).append(roomTypeImage);
    $(roomTypeElement).append(roomTypeInfo);
    $(roomTypeInfo).append(roomTypeName);
    $(".confirmation-booking-roomtype").append(roomTypeElement);

    $(".confirmation-booking-reservation").append("<div >" + reservation.firstName + "</div>");
    $(".confirmation-booking-reservation").append("<div >" + reservation.lastName + "</div>");
    $(".confirmation-booking-reservation").append("<div >" + reservation.email + "</div>");
    $(".confirmation-booking-reservation").append("<div >" + reservation.paymentAddress + "</div>");
    $(".confirmation-booking-reservation").append("<div >" + reservation.price + "</div>");
    $(".confirmation-booking-reservation").append("<div >" + reservation.reservationId + "</div>");
    $(".confirmation-booking-reservation").append("<div ><a target='_blank' href='https://ropsten.etherscan.io/tx/" + reservation.transactionId + "'>https://ropsten.etherscan.io/tx/" + reservation.transactionId + "</a></div>");

}

var loaderVisible = false;

function DisplayLoader() {
    if (loaderVisible === false) {
        loaderVisible = true;
        $(".loader-overlay").show();
    } else {
        loaderVisible = false;
        $(".loader-overlay").hide();
    }
}