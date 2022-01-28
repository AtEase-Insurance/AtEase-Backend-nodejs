// Send verification email to user email on registration
exports.verifyEmail = ({ currentUrl, _id, email, uniqueString }) => ({
  from: process.env.CURRENT_EMAIL,
  to: email,
  subject: "Verify Your Email",
  html: `<p>Verify your email address to complete the signup and login into your account.</p>
           <p>This link <b>expires in 10 minutes</b>.</p>
           <p>Click <a href=${
             currentUrl +
             "/user/verification/signup/" +
             _id +
             "/" +
             uniqueString
           }>here</a> to proceed.</p>
           `,
});

// Send password reset link to user email on request through forgot password
exports.resetPassword = ({ currentUrl, email, otp }) => ({
  from: process.env.CURRENT_EMAIL,
  to: email,
  subject: "Reset Your Password",
  html: `<p>We are sending you this email because you requested a password reset.</p>
           <p>This is your OTP:</p>
           <h1>${otp}</h1>
           <p>Click <a href=${
             currentUrl + "/resetpassword"
           }>here</a> to proceed to reset your password.</p>
           `,
});

// Send user's enquiry message to email for CRM to work on
exports.receiveEnquiry = ({ enquiry }) => ({
  from: process.env.CURRENT_EMAIL,
  to: process.env.CURRENT_EMAIL,
  subject: `Enquiry from ${enquiry.name}`,
  html: ` <h2>Enquiry from ${enquiry.name}.</h2>
          <p></p>
          <h3>Details</h3>
          <p><b>Name: </b>${enquiry.name}</p>
          <p><b>Subject: </b>${enquiry.subject}</p>
          <p><b>Email: </b>${enquiry.email}</p>
          <p><b>Phone No: </b>${enquiry.phoneNo}</p>
          <p><b>Message: </b>${enquiry.message}</p>
          `,
});

// Send user confirmation of enquiry sent
exports.enquirySent = ({ enquiry }) => ({
  from: process.env.CURRENT_EMAIL,
  to: enquiry.email,
  subject: `Your Enquiry to AtEase Insurance Was Lodged.`,
  html: ` <h2>Your Enquiry to AtEase Insurance.</h2>
          <p></p>
          <h3>Details</h3>
          <p><b>Name: </b>${enquiry.name}</p>
          <p><b>Subject: </b>${enquiry.subject}</p>
          <p><b>Email: </b>${enquiry.email}</p>
          <p><b>Phone No: </b>${enquiry.phoneNo}</p>
          <p><b>Message: </b>${enquiry.message}</p>
        `,
});

// Send user
exports.signupSuccessful = ({ email }) => ({
  from: process.env.CURRENT_EMAIL,
  to: email,
  subject: "SignUp Successful",
  html: ` <h2>Congratulations!!!</h2>
          <p>You have successfully completed your registration.</p>
        `,
});

exports.passwordChanged = ({ email }) => ({
  from: process.env.CURRENT_EMAIL,
  to: email,
  subject: "Password Change",
  html: ` <p>Your password was recently changed.</p>
          <p>If this wasn't you, please attempt to log in and
           use the password reset, else ignore this message.</p>
           `,
});
