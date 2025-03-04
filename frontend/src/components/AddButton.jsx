import React from 'react'

function AddButton({onClick}) {
  return (
        <button className="fixed bottom-4 right-4 w-10 h-10 flex justify-center items-center rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer" onClick={onClick}> + </button>
  )
}

export default AddButton
