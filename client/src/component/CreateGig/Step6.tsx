import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { axiosInstance } from "../../utility/axiosInstance";
import {
  CountryWithPhoneCodes,
  countryWithPhoneCodesData,
} from "./CountryPhoneCode";
import { StepProps, StepRef } from "../../Pages/CreateGig/CreateGig";
// @ts-ignore
import { toast } from "react-toastify";
import { IoIosClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

type Step6Props = {};

const Step6 = ({ handleSendData }: StepProps, ref: React.Ref<StepRef>) => {
  const { gigDetail } = useSelector((state: RootState) => state.gigDetail);
  const params = useParams();
  const navigate = useNavigate();
  const [showVerifyPhoneNumberModal, setShowVerifyPhoneNumberModal] =
    useState(false);
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(
    countryWithPhoneCodesData
  );
  const [dialCode, setDialCode] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerifyCodeInput, setShowVerifyCodeInput] = useState(false);
  const verificationCodeErrorRef = useRef<HTMLParagraphElement>(null);
  const invalidPhoneNumberRef = useRef<HTMLDivElement>(null);

  // FINAL STEP
  const [showGigPublishFinalModal, setShowGigPublishFinalModal] =
    useState(false);
  const [verifiedStatusOfSeller, setVerifiedStatusOfSeller] = useState(false);

  const handleCloseVerifyPhoneNumberModal = () => {
    setShowVerifyPhoneNumberModal(false);
    setShowVerifyCodeInput(false);
    setVerificationCode("");
  };

  const handleShowVerifyPhoneNumberModal = () => {
    setShowVerifyPhoneNumberModal(true);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
  };

  useEffect(() => {
    let temp = countryWithPhoneCodesData
      .filter((item) =>
        item.name.toLowerCase().startsWith(country.toLowerCase())
      )
      .slice(0, 8);
    setFilteredCountries(temp);
  }, [country]);

  const handleClickOnCountryListItem = (item: CountryWithPhoneCodes) => {
    setCountry(item.name);
    setDialCode(item.dial_code);
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
    if (verificationCodeErrorRef.current)
      verificationCodeErrorRef.current.style.display = "none";
  };

  const handleGoBackToEnterPhoneNumber = () => {
    setShowVerifyCodeInput(false);
    setVerificationCode("");
    if (verificationCodeErrorRef.current)
      verificationCodeErrorRef.current.style.display = "none";
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    if (invalidPhoneNumberRef.current)
      invalidPhoneNumberRef.current.style.display = "none";
  };

  const handleVerifyPhoneNumber = async () => {
    const phone = {
      code: dialCode,
      number: phoneNumber,
    };
    const body = {
      phone: phone,
    };
    let data;
    try {
      data = await axiosInstance.post("/verify/number", body);
      data = data.data;
    } catch (err: any) {
      if (err.response.status !== 403) {
        if (invalidPhoneNumberRef.current)
          invalidPhoneNumberRef.current.style.display = "block";
      }
      toast.error("Something went wrong. Please try again later.");
      console.log(err);
    }
    if (data?.success) {
      setShowVerifyCodeInput(true);
    }
  };

  const handleVerifyCode = async () => {
    const phone = {
      code: dialCode,
      number: phoneNumber,
    };
    const body = {
      code: verificationCode,
      phone: phone,
    };
    const { data } = await axiosInstance.post("/verify/code", body);

    if (data.success) {
      if (verificationCodeErrorRef.current)
        verificationCodeErrorRef.current.style.display = "none";
      setShowVerifyPhoneNumberModal(false);
      setShowVerifyCodeInput(false);
      setVerificationCode("");
      setShowGigPublishFinalModal(true);
      setVerifiedStatusOfSeller(true);
    } else {
      if (verificationCodeErrorRef.current)
        verificationCodeErrorRef.current.style.display = "block";
    }
  };

  const handleSubmit = async () => {
    const payload = {
      step: 6,
      data: {
        active: true,
      },
    };
    const res = await handleSendData(payload);
    return res || false;
  };

  useEffect(() => {
    if (!gigDetail) return;
    const { active } = gigDetail;
    setVerifiedStatusOfSeller(active || false);
    setShowGigPublishFinalModal(active || false);
  }, [gigDetail]);

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <>
      <div className="publish mb-12">
        <div className="publish-wrapper">
          {showGigPublishFinalModal && verifiedStatusOfSeller ? (
            <>
              <div className="gig-publish-final-modal">
                <h3>Almost there...</h3>
                <p>
                  Let's publish your Gig and get <br /> some buyers rolling in.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="publish-image-wrapper"></div>
              <div className="publish-text-wrapper">
                <h3>Congratulations!</h3>
                <p className="main-para">
                  You're almost done with your first Gig.
                </p>
                <p>
                  Before you start selling on FreelanceMe, there is one last
                  thing we need you to do: The security of your account is
                  important to us. Therefore, we require all our sellers to
                  verify their phone number before we can publish their Gig.
                </p>
              </div>
            </>
          )}

          {showVerifyPhoneNumberModal && (
            <div className="verify-phone-number-modal-wrapper">
              <div className="verify-phone-number-modal">
                <div
                  className="close-icon"
                  onClick={handleCloseVerifyPhoneNumberModal}
                >
                  <IoIosClose />
                </div>
                <h5>Verify Phone Number</h5>

                {showVerifyCodeInput ? (
                  <>
                    <p className="verfication-code-sent-notification">
                      A verification code has been sent to:
                    </p>

                    <div className="verification-code-recipent-number">
                      <span>{dialCode}</span>
                      <span>-</span>
                      <span>{phoneNumber}</span>
                    </div>

                    <div className="verification-code-wrapper">
                      <p className="enter-verification-code-message">
                        Please enter the Verification code
                      </p>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                      />
                      <p
                        ref={verificationCodeErrorRef}
                        className="invalid-code-message"
                      >
                        Oops... that code is wrong..
                        <br />
                        Please verify your code and try again.
                      </p>
                      <button
                        className={
                          verificationCode.length === 6 ? "active" : ""
                        }
                        onClick={handleVerifyCode}
                      >
                        Submit Code
                      </button>
                    </div>

                    <p className="verification-code-not-receive-message">
                      If you did not receive the code, please click
                      <span
                        // onClick={() => {
                        //   setShowVerifyCodeInput(false);
                        //   setVerificationCode("");
                        // }}
                        onClick={handleGoBackToEnterPhoneNumber}
                      >
                        {" "}
                        Back
                      </span>
                      , check that you have entered the right number, and try
                      again
                    </p>
                  </>
                ) : (
                  <>
                    <p className="thanks-para">
                      Thank you for taking a moment to verify your phone number.{" "}
                    </p>

                    <div className="modal-inputs-wrapper">
                      <div className="modal-input">
                        <h6>Enter Country</h6>
                        <input
                          type="text"
                          value={country}
                          onChange={handleCountryChange}
                          id="country"
                          onFocus={() => setShowCountryDropdown(true)}
                        />
                        {showCountryDropdown &&
                          country &&
                          filteredCountries.length > 0 && (
                            <ul className="country-code-wrapper">
                              {filteredCountries.map((countryData, index) => {
                                return (
                                  <li
                                    className="country-code"
                                    onClick={() =>
                                      handleClickOnCountryListItem(countryData)
                                    }
                                  >
                                    <p>{countryData.name}</p>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                      </div>
                      <div className="modal-input">
                        <h6>Enter Phone Number</h6>
                        {dialCode && <p className="dial-code">{dialCode} - </p>}
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          onFocus={() => setShowCountryDropdown(false)}
                        />
                      </div>
                      <div
                        ref={invalidPhoneNumberRef}
                        className="wrong-phone-number-warning"
                      >
                        Please enter a valid number
                      </div>
                    </div>

                    <div className="verify-buttons">
                      <button
                        className={
                          phoneNumber.length >= 5 && country && dialCode
                            ? "button-active"
                            : ""
                        }
                        onClick={handleVerifyPhoneNumber}
                      >
                        Verify
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="save-and-verify">
        {showGigPublishFinalModal && verifiedStatusOfSeller ? (
          <button onClick={handleSubmit}>Publish Gig</button>
        ) : (
          <button onClick={handleShowVerifyPhoneNumberModal}>Verify Now</button>
        )}
      </div>
    </>
  );
};

export default forwardRef(Step6);
