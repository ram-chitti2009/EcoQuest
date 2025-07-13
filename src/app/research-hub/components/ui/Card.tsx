//Custom Card Component

export function Card({children, className = ''} : {children : React.ReactNode; className? : string}) {
    return (
        <div className = {`bg-white shadow-sm rounded-lg border ${className}`}>
            {children}  
        </div>
    )
}
