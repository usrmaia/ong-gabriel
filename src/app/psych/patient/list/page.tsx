import { ChevronLeft, Plus, UserCircle } from "lucide-react";
import Image from "next/image";

const patients = [
    {
        name: "Flor Souza",
        avatar: "/avatars/flor.png",
    },
    {
        name: "Maria Santos",
        avatar: "/avatars/maria.png",
    },
];

export default function PatientListPage() {
    return (
        <div className="flex flex-col items-center justify-between p-0 relative">
            <div className="w-full flex flex-col items-center">
                <div className="flex items-center w-full pl-2 mb-6 gap-8">
                    <ChevronLeft size={32} />
                    <h3 className="text font-bold text-gray-800">Pacientes</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {patients.map((patient) => (
                        <div
                            key={patient.name}
                            className="bg-white rounded-xl shadow-xl flex flex-col justify-center items-center py-3 px-2 w-[160px] h-[200px] gap-3"
                        >
                            <div className="flex justify-center">
                                <Image
                                    src={patient.avatar}
                                    alt={patient.name}
                                    width={64}
                                    height={64}
                                    className="rounded-full border-2 border-[#7ab8c0] object-cover"
                                />
                            </div>
                            <span className="text-lg font-medium text-gray-800 text-center font-poppins">
                                {patient.name.split(" ")[0]}
                                <br />
                                {patient.name.split(" ")[1]}
                            </span>
                        </div>
                    ))}
                    <div className="bg-white rounded-xl shadow-xl flex flex-col justify-center items-center py-3 px-2 w-[160px] h-[200px] gap-3">
                        <UserCircle className="text-[#7ab8c0]" size={50} />
                        <Plus className="text-[#7ab8c0]" size={32} />
                    </div>
                </div>
            </div>
        </div>
    );
}