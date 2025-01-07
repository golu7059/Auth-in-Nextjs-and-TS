export default function UserProfile({params} : any) {
    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-xl font-semibold ">Profile Page of userId : 
               <span className="text-red-500 text-2xl font-bold"> {params.id} </span>
                </h1>
        </div>
    )
}
