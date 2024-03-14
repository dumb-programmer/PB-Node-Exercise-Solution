import useAuthContext from "@/hooks/useAuthContext"

export default function Home() {
    const { auth } = useAuthContext();
    if (auth) {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <div className="card w-96 shadow-md">
                    <div className="card-body flex flex-col gap-4">
                        <h1 className="card-title">Welcome</h1>
                        <div>
                            ID: {auth.id}
                        </div>
                        <div>
                            Name: {auth.name}
                        </div>
                        <div>
                            Phone: {auth.phone_number}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null;
}
