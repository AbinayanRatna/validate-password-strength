import React, {
  useState,
  CSSProperties,
  InputHTMLAttributes,
  useImperativeHandle,
  forwardRef
} from 'react';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import "./styles.css";

export interface PasswordFieldWithStrengthHandle {
  validate: () => boolean;
  getValues: () => { password: string; confirmPassword: string };
}

export interface PasswordFieldWithStrengthProps extends InputHTMLAttributes<HTMLInputElement> {
  inputStyle?: CSSProperties;
  passwordInputWrapper?: CSSProperties;
  iconContainer?: CSSProperties;
  smallIcon1?: CSSProperties;
  largeIcon1?: CSSProperties;
  largeIcon2?: CSSProperties;
  smallIcon2?: CSSProperties;
  strengthTextCommon?: CSSProperties;
  errorMessagePassword?: CSSProperties;
  errorMessageText?: CSSProperties;
  strengthColor1?: CSSProperties;
  strengthColor2?: CSSProperties;
  strengthColor3?: CSSProperties;
  confirmPasswordWrapper?: CSSProperties;

  wrapperClassName?: string;
  inputClassName?: string;
  iconContainerClassName?: string;
  strengthTextClassName?: string;
  errorMessageClassName?: string;
  passwordInputWrapperClassName?: string;
  confirmPasswordWrapperClassName?: string;

  minUppercase?: number;
  minLowercase?: number;
  minNumbers?: number;
  minSpecialChars?: number;
  minLength?: number;
}

export const PasswordFieldWithStrength = forwardRef<
  PasswordFieldWithStrengthHandle,
  PasswordFieldWithStrengthProps
>(({
  inputStyle,
  passwordInputWrapper,
  iconContainer,
  smallIcon1,
  largeIcon1,
  largeIcon2,
  smallIcon2,
  strengthTextCommon,
  errorMessagePassword,
  errorMessageText,
  strengthColor1,
  strengthColor2,
  strengthColor3,
  confirmPasswordWrapper,
  wrapperClassName = "",
  inputClassName = "",
  iconContainerClassName = "",
  strengthTextClassName = "",
  errorMessageClassName = "",
  passwordInputWrapperClassName = "",
  confirmPasswordWrapperClassName = "",

  minUppercase = 1,
  minLowercase = 1,
  minNumbers = 1,
  minSpecialChars = 1,
  minLength = 8,

  ...restProps
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRetypePasswordVisible, setIsRetypePasswordVisible] = useState(false);
  const [errorMessageNumber, setErrorMessageNumber] = useState(0);

  const [passwordStatus, setPasswordStatus] = useState({
    weak: false,
    medium: false,
    strong: false
  });

  const [inputErrors, setInputErrors] = useState({
    noPassword: false,
    passwordNotMatch: false,
    passwordErrors: false,
  });

  const [userDetails, setUserDetails] = useState({
    password: "",
    confirmPassword: ''
  });

  const errorMessages = [
    '',
    `Password must contain at least ${minUppercase} uppercase letter`,
    `Password must contain at least ${minLowercase} lowercase letter`,
    `Password must contain at least ${minNumbers} numeric digit`,
    `Password must contain at least ${minSpecialChars} special character(@,#..)`,
    `Password length must be greater than ${minLength} characters`
  ];

  const regexPatterns = [
    new RegExp(`^.{1,${minLength - 1}}$`),
    new RegExp(`^(?:[a-z]{${minLength},}|[A-Z]{${minLength},}|[0-9]{${minLength},}|[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{${minLength},})$`),
   
  ];

  const patterns = {
    upper: new RegExp(`(.*[A-Z]){${minUppercase},}`),
    lower: new RegExp(`(.*[a-z]){${minLowercase},}`),
    digit: new RegExp(`(.*[0-9]){${minNumbers},}`),
    special: new RegExp(`(.*[!@#*$%^&+=]){${minSpecialChars},}`),
    totalLength: new RegExp(`^.{${minLength},}$`)
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      let valid = true;
      const newErrors = {
        noPassword: false,
        passwordNotMatch: false,
        passwordErrors: false,
      };

      if (!userDetails.password) {
        newErrors.noPassword = true;
        valid = false;
      }

      if (userDetails.password !== userDetails.confirmPassword) {
        newErrors.passwordNotMatch = true;
        valid = false;
      }

      if (!passwordStatus.strong) {
        newErrors.passwordErrors = true;
        valid = false;
      }

      setInputErrors(newErrors);
      return valid;
    },
    getValues: () => ({
      password: userDetails.password,
      confirmPassword: userDetails.confirmPassword
    })
  }));

  return (
    <div className={wrapperClassName}>
      <div
        className={`password-input-wrapper ${inputErrors.noPassword ? "no-password" : ""} ${passwordInputWrapperClassName}`}
        style={passwordInputWrapper}
      >
        <input
          className={`input-style ${inputClassName}`}
          style={inputStyle}
          value={userDetails.password}
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Password"
          onChange={(e) => {
            const inputValue = e.target.value.replace(/\s+/g, '').trim();
            setUserDetails(prev => ({ ...prev, password: inputValue }));

            if (inputValue !== "") {
              setInputErrors(prev => ({ ...prev, noPassword: false }));

              if (patterns.digit.test(inputValue) && patterns.lower.test(inputValue) && patterns.special.test(inputValue) && patterns.totalLength.test(inputValue) && patterns.upper.test(inputValue)) {
                setPasswordStatus({ strong: true, medium: false, weak: false });
              } else if (regexPatterns[1].test(inputValue)) {
                setPasswordStatus({ strong: false, medium: true, weak: false });
              } else if (regexPatterns[0].test(inputValue)) {
                setPasswordStatus({ strong: false, medium: false, weak: true });
              } else {
                setPasswordStatus({ strong: false, medium: true, weak: false });
              }

              const uppercaseCount = (inputValue.match(/[A-Z]/g) || []).length;
              const lowercaseCount = (inputValue.match(/[a-z]/g) || []).length;
              const digitCount = (inputValue.match(/[0-9]/g) || []).length;
              const specialCharCount = (inputValue.match(/[!@#*$%^&+=]/g) || []).length;

              if (uppercaseCount < minUppercase) setErrorMessageNumber(1);
              else if (lowercaseCount < minLowercase) setErrorMessageNumber(2);
              else if (digitCount < minNumbers) setErrorMessageNumber(3);
              else if (specialCharCount < minSpecialChars) setErrorMessageNumber(4);
              else if (inputValue.length < minLength) setErrorMessageNumber(5);
              else setErrorMessageNumber(0);
            } else {
              setPasswordStatus({ strong: false, medium: false, weak: false });
              setErrorMessageNumber(0);
            }
          }}
        />
        <div
          className={`icon-container ${iconContainerClassName}`}
          style={iconContainer}
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (
            <>
              <MdOutlineVisibilityOff size={23} className="hide-on-xl" style={smallIcon1} />
              <MdOutlineVisibilityOff size={30} className="show-on-xl" style={largeIcon1} />
            </>
          ) : (
            <>
              <MdOutlineVisibility size={23} className="hide-on-xl" style={smallIcon2} />
              <MdOutlineVisibility size={30} className="show-on-xl" style={largeIcon2} />
            </>
          )}
        </div>
      </div>

      {/* Password Strength */}
      {passwordStatus.weak && (
        <p className={`strength-text-common ${strengthTextClassName}`}
          style={strengthTextCommon}
        >
          Password strength: <span className="strength-color-1" style={strengthColor1}>Weak</span>
        </p>
      )}
      {passwordStatus.medium && (
        <p className={`strength-text-common ${strengthTextClassName}`} style={strengthTextCommon}>
          Password strength: <span className="strength-color-2" style={strengthColor2}>Medium</span>
        </p>
      )}
      {passwordStatus.strong && (
        <p className={`strength-text-common ${strengthTextClassName}`} style={strengthTextCommon}>
          Password strength: <span className="strength-color-3" style={strengthColor3}>Strong</span>
        </p>
      )}
      {errorMessageNumber !== 0 && (
        <p className={`error-message-password ${errorMessageClassName}`} style={errorMessagePassword}>
          {errorMessages[errorMessageNumber]}
        </p>
      )}
      {inputErrors.noPassword && (
        <p className={`input-errors-text ${errorMessageClassName}`} style={errorMessageText}>
          Password is required.
        </p>
      )}

      <div
        className={`confirm-password password-input-wrapper ${inputErrors.passwordNotMatch ? "no-password" : ""} ${confirmPasswordWrapperClassName}`}
        style={confirmPasswordWrapper}
      >
        <input
          className={`input-style ${inputClassName}`}
          style={inputStyle}
          value={userDetails.confirmPassword}
          type={isRetypePasswordVisible ? "text" : "password"}
          placeholder="Confirm Password"
          onChange={(e) =>
            setUserDetails(prev => ({ ...prev, confirmPassword: e.target.value }))
          }
        />
        <div
          className={`icon-container ${iconContainerClassName}`}
          style={iconContainer}
          onClick={() => setIsRetypePasswordVisible(!isRetypePasswordVisible)}
        >
          {isRetypePasswordVisible ? (
            <>
              <MdOutlineVisibilityOff size={23} className="hide-on-xl" style={smallIcon1} />
              <MdOutlineVisibilityOff size={30} className="show-on-xl" style={largeIcon1} />
            </>
          ) : (
            <>
              <MdOutlineVisibility size={23} className="hide-on-xl" style={smallIcon2} />
              <MdOutlineVisibility size={30} className="show-on-xl" style={largeIcon2} />
            </>
          )}
        </div>
      </div>
      {inputErrors.passwordNotMatch && (
        <p className={`input-errors-text ${errorMessageClassName}`} style={errorMessageText}>
          Passwords do not match.
        </p>
      )}
    </div>
  );
});
