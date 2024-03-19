export const errorResponseCode = {
  "400001": "Missing fields!",

  "401001": "You need to login first!",

  "403001": "Invalid format in validators!",
  "403002": "You are not allowed to perform this action!",

  "403101": "Send mail verify error!",
  "403102": "You need to create verification code before verify!",
  "403103": "Wrong verification code!",

  "403201": "Username is not changeable!",
  "403202": "Phone number already exist!",
  "403203": "Old password not match!",
  "403204": "Missing old password!",
  "403205": "Invalid phone number!",
  "403206": "Invalid email!",
  "403207": "Email already exist!",
  "403208": "Selected role is not allowed!",
  "403209": "Selected role not exist!",
  "403210": "Provide username!",
  "403211": "Username can't contain blank space!",
  "403212": "Provide password!",
  "403213": "Username must from 6 characters!",
  "403214": "Password must from 6 characters!",
  "403215": "Username already exist!",

  "404001": "Invalid username or password!",
  "404002": "User not found!",

  "500": "Serve occurred an uncaught error!",

  "500001": "Error uploading file(s)!",
} as const;
