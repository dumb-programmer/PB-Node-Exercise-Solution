import useAuthContext from "@/hooks/useAuthContext";
import { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";

export default function Verify() {
    const [otp, setOtp] = useState(Array(4).fill(""))
    const inputRefs = useRef(Array(4).fill(null));
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        otp: "",
        general: ""
    });
    const navigate = useNavigate();
    const { state } = useLocation();
    const { setAuth } = useAuthContext();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(+e.target.value)) {
            return;
        }
        const index = e.target.getAttribute("data-index");

        if (index) {
            setOtp((otp) => {
                const value = +e.target.value;
                const newOtp = [...otp]
                if (value > -1 && value < 9) {
                    newOtp[+index] = e.target.value
                }
                return newOtp
            })
            if (+index < 3) {
                inputRefs.current[+index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const index = (e.target as HTMLInputElement).getAttribute("data-index");
        if (e.key == "Backspace" && index) {
            e.preventDefault();
            setOtp((otp) => {
                const newOtp = [...otp]
                newOtp[+index] = ""
                return newOtp
            })
            if (+index > 0) {
                inputRefs.current[+index - 1].focus()
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otp_string = otp.join("");
        console.log("Hello")
        if (otp_string.length === 4) {
            try {
                setLoading(true)
                const response = await fetch(`http://localhost:3000/api/users/${state.userId}/verifyOTP?otp=${otp_string}`, {
                    mode: "cors"
                });
                const responseData = await response.json();
                if (response.status === 404) {
                    setErrors(errors => ({ ...errors, general: "Invalid credentials" }));
                }
                else if (responseData?.message && responseData?.message.includes("expired")) {
                    setErrors(errors => ({ ...errors, general: "OTP expired" }))
                }
                else if (responseData?.message && responseData?.message.includes("Invalid")) {
                    setErrors(errors => ({ ...errors, general: "OTP invalid" }))
                }
                else if (response.ok) {
                    console
                    setAuth(responseData)
                    navigate("/");
                }
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);

            }
        }
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="card shadow-md">
                <div className="card-body">
                    <h1 className="card-title mb-4">Enter OTP</h1>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="form-control flex flex-row gap-2">
                            {
                                Array.from({ length: 4 }).map((_, index) => <input ref={(ref) => (inputRefs.current[index] = ref)}
                                    className="input input-bordered w-20" data-index={index} onChange={handleInput} value={otp[index]} onKeyDown={handleKeyDown} maxLength={1} />
                                )
                            }
                            <span className="text-red-500 text-xs mt-2">{errors["otp"]}</span>
                        </div>
                        <span className="text-red-500 text-xs mt-2">{errors["general"]}</span>
                        <button type="submit" className={`btn btn-primary ${loading ? "loading loading-spinner" : ""}`}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
