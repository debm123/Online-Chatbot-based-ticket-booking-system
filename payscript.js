$(document).ready(function() {
    $(".generate_qr").click(function() {
        $(".form").hide();
        $(".qr_code").show();
        var num = $(".number").val();
        var link = "upi://pay?pa=ayushmondal139@okhdfcbank%26am=1500%26tn=" + num;
        var upi = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + link;
        console.log(upi);
        $(".get_qr").attr("src", upi);
    });

    $(".download_now").click(function() {
        var name = $(".name").val();
        var num = $(".number").val();
        var email = $(".email").val();
        var id = $(".id").val();
        if (num != "" && name != "" && email != "" && id != "") {
            // Assuming the payment confirmation is successful
            sendOtp(num, function(response) {
                if (response.success) {
                    alert("Payment confirmed. OTP sent to your phone number as a digital ticket.");
                } else {
                    alert("Failed to send OTP. Please try again.");
                }
            });
        } else {
            alert("Fill all fields correctly");
        }
    });

    function sendOtp(phoneNumber, callback) {
        $.ajax({
            url: 'send_otp.php',
            type: 'POST',
            data: { phone: phoneNumber },
            success: function(response) {
                callback(response);
            },
            error: function() {
                callback({ success: false });
            }
        });
    }
});
