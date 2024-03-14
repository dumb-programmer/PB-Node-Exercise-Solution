import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [data, setData] = useState({
        name: "",
        phone_number: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        phone_number: "",
        name: "",
        conflict: ""
    });
    const navigate = useNavigate();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(data => (
            {
                ...data,
                [e.target.name]: e.target.value
            }
        ))
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data.name && data.phone_number) {
            try {
                setLoading(true)
                const response = await fetch("http://localhost:3000/api/users", {
                    method: "POST", body: JSON.stringify(data), mode: "cors", headers: {
                        "Content-Type": "application/json"
                    }
                });
                const responseData = await response.json();
                if (response.status == 409) {
                    setErrors(errors => ({ ...errors, conflict: "A user with this phone number is already registered" }))
                }
                if (response.ok) {
                    navigate("/login", { state: { message: "User created" } })
                }
                else {
                    setErrors(errors => ({ ...errors, ...responseData.errors }));
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
            <div className="card w-96 shadow-md">
                <div className="card-body">
                    <h1 className="card-title mb-4">Signup</h1>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label" htmlFor="phone_number">Phone No</label>
                            <input className="input input-bordered" type="tel" id="phone_number" name="phone_number" onChange={handleInput} required />
                            <span className="text-red-500 text-xs mt-2">{errors["phone_number"]}</span>
                        </div>
                        <div className="form-control">
                            <label className="label" htmlFor="name">Name</label>
                            <input className="input input-bordered" id="name" name="name" onChange={handleInput} required />
                            <span className="text-red-500 text-xs mt-2">{errors["name"]}</span>
                        </div>
                        <span className="text-red-500 text-xs mt-2">{errors["conflict"]}</span>
                        <button type="submit" className={`btn btn-primary ${loading ? "loading loading-spinner" : ""}`}>Signup</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
