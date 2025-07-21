import React from 'react'
import theme from "../../app/theme";

function button(info) {
    return (
        <>
            <button
                onClick={info.click ? ()=> info.click() : undefined}
                type="submit"
                className={`w-auto sm:w-[10rem] md:w-${info.w} h-${info.h? info.h : ""} text-white py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm font-medium`}
                style={{ backgroundColor: theme.color }}
            >
                <span className="hidden sm:inline">{info.text}</span>
                <span className="sm:hidden">{info.smallText}</span>
            </button>
        </>
    )
}

export default button