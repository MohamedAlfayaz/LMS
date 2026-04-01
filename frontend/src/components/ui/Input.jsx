export default function Input({
    label,
    icon,
    error,
    labelClass = "",
    placeholder = "",
    ...props
}) {
    return (
        <div className="relative">

            {/* INPUT WRAPPER */}
            <div
                className={`flex items-center gap-2 px-3 pt-5 pb-2 
                    border rounded-xl 
                    transition-all duration-200
                    ${error ? "border-red-500" : "border-gray-700"}
                    focus-within:border-blue-500 
                    focus-within:ring-1 focus-within:ring-blue-500`}
            >
                {icon && (
                    <span className="text-gray-700 text-sm">
                        {icon}
                    </span>
                )}

                <input
                    {...props}
                    placeholder={placeholder}  // IMPORTANT
                    className="w-full bg-transparent outline-none text-sm text-gray-800 peer"
                />
            </div>

            {/* FLOATING LABEL */}
            {label && (
                <label
                    className={`absolute left-3 transition-all duration-200 pointer-events-none
          
                    /* default (floating) */
                    top-1.5 text-xs text-gray-700
                    
                    /* when empty */
                    peer-placeholder-shown:top-3.5 
                    peer-placeholder-shown:text-sm 
                    peer-placeholder-shown:text-gray-500
                    
                    /* when focus */
                    peer-focus:top-1.5 
                    peer-focus:text-xs 
                    peer-focus:text-blue-400
                    
                    ${labelClass}`}
                >
                    {label}
                </label>
            )}

            {/* ERROR */}
            {error && (
                <p className="text-red-400 text-xs mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}