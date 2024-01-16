import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import { getTheme } from 'formula_one'
import Dropdown from './dropdown'
import { addIssue, setAppList } from '../actions'

import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"
import { urlStatic } from '../urls'
import { themeBg, themeBorder, themeText } from '../constants/theme'
import { CrossIcon, OtherApp, SubmitIcon, UploadIcon } from './icons'

const Label = ({label, children, hasError}) => {
    return (
        <div className={tailwindWrapper("py-2")}>
            <label className={tailwindWrapper("block text-gray-700 text-sm font-bold mb-2")}>{label}</label>
            {children}
            {hasError && <p className={tailwindWrapper("text-red-500 text-xs italic pb-2 pl-1")}>{`${label} is required.`}</p>}
        </div>
  )}

const AddQuery = ({ history, appList, AddIssue, SetAppList, paginationIndex}) => {
    const [open, setOpen] = useState(false)
    const [subject, setSubject] = useState('')
    const [query, setQuery] = useState('')
    const [app, setApp] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [fileSrc, setFileSrc] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
        
    const theme = getTheme()
    const fileInputRef = useRef(null)

    useEffect(() => {
        const url = new URLSearchParams(history.location.search)
        setApp(url.get('app') || null)

        if (!appList.isLoaded)
            SetAppList()
    }, [])
    
    const handleUpload = () => fileInputRef.current.click()
    const handleAppChange = (newApp) => setApp(newApp)
    const fileChange = (e) =>
    {
        setUploadedFile(e.target.files[0])
        setFileSrc(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : '')
    }
    const removeImage = () => {
        setUploadedFile(null)
        setFileSrc('')
    }

    const handleSubmit = () => {
        const url = new URLSearchParams(history.location.search)

        if (query && app && subject)
        {
            const formData = new FormData()
            formData.append('title', subject)
            formData.append('app_name', app)
            formData.append('query', query)
            uploadedFile ? formData.append('uploaded_file', uploadedFile) : null

            AddIssue(
                formData,
                paginationIndex.index,
                paginationIndex.status,
                successCallBack,
                errCallBack
            )

            setSubject('')
            setQuery('')
            setApp(url.get('app') || null)
            setUploadedFile(null)
            setFileSrc('')
        }
    }

    const successCallBack = (res) => {
        setSuccess(true)
        setError(false)
    }

    const errCallBack = (err) => {
        setSuccess(false)
        setError(true)
    }

    const options = appList.data.map((app, index) => {
        const appData = {
            key: index + 1,
            value: app.nomenclature.verboseName,
            text: app.nomenclature.verboseName,
        }
        if (app.assets && app.assets.favicon){
            appData['content'] = (<img src={`/static/${app.baseUrls.static}${app.assets.favicon}`} className={tailwindWrapper("h-6 w-6 mr-2.5")} />)
        }
        return appData
    })
    options.push({ key: 0, value: 'Other', text: 'Other' })
  
    return (
        <div className={tailwindWrapper("px-4 md:w-3/4 w-full border rounded border-[#DEDEDF] ml-3 mt-14 mb-4 pt-4")}> 
            {success && (
                <div className={tailwindWrapper("bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-1 rounded relative")} role="alert">
                    <strong className={tailwindWrapper("font-bold")}>Success!</strong>
                    <span className={tailwindWrapper("block sm:inline")}> Your query has been submitted.</span>
                </div>
            )}
            {error && (
                <div className={tailwindWrapper("bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-1 rounded relative")} role="alert">
                    <strong className={tailwindWrapper("font-bold")}>Error!</strong>
                    <span className={tailwindWrapper("text-red-700 font-semibold")}> An error occurred. Please try again.</span>   
                </div>
            )}
            <div className={tailwindWrapper("rounded-md")}>
                <form>
                    <div className={tailwindWrapper("form-group")}>
                        <Label label='App' hasError={false}>
                        <Dropdown options={options} selectedOption={app} setOption={handleAppChange} open={open} setOpen={setOpen} width={"w-full"} otherContent={OtherApp} placeholder={"Select an App"}/>
                        </Label>
                        <Label label='Subject' hasError={false}>
                            <input type="text" value={subject} className={tailwindWrapper("shadow appearance-none border rounded w-full py-2 px-3 placeholder-[#BFBFBFDE] leading-tight focus:outline-none focus:shadow-outline")} placeholder="Subject" onChange={(e) => setSubject(e.target.value)}/>
                        </Label>
                        <Label label='Add query' hasError={false}>
                            <textarea rows={3} type="text" className={tailwindWrapper("shadow appearance-none border rounded w-full py-2 px-3 placeholder-[#BFBFBFDE] leading-tight focus:outline-none focus:shadow-outline")} placeholder="Add Query" value={query} onChange={(e) => setQuery(e.target.value)}/>
                        </Label>
                    </div>
                    <div className={tailwindWrapper("flex justfiy-content items-center text-sm gap-4")}>
                        <img src={`${urlStatic()}link.svg`} alt="Link" className={tailwindWrapper("w-8 h-8")} />
                        <span>Attach link of your query page.</span>
                    </div>
                    <button type="button" className={tailwindWrapper(`flex justify-content gap-1 border border-2 my-5 rounded-md ${themeText[theme]} ${themeBorder[theme]} inline-block py-2 pl-5 pr-6 rounded focus:outline-none focus:shadow-outline`)}
                    onClick={handleUpload}>
                        <UploadIcon />
                        <span>Upload</span>
                    </button>
                    <input hidden type='file' onChange={fileChange} name={'uploadedFile'} id='uploadFile' ref={fileInputRef} />
                    {fileSrc && (
                        <div className={tailwindWrapper("my-4")}>
                            {uploadedFile.type.includes('image') ? (
                                <div className={tailwindWrapper("relative group sm:w-1/2 lg:w-1/3 lg:h-1/3 w-full h-full")}>
                                    <img
                                        src={fileSrc}
                                        alt="Uploaded Image"
                                        className={tailwindWrapper("rounded-lg cursor-pointer")}
                                    />
                                    <div className={tailwindWrapper("absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center")}>
                                        <button className={tailwindWrapper("text-red")} onClick={removeImage}>
                                            <CrossIcon dimension={"w-8 h-8"}/>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={tailwindWrapper("flex justify-content items-center gap-2 py-2")}>
                                    <span className="mr-2">
                                        <a href={fileSrc} target="_blank" className={tailwindWrapper("text-blue-500 hover:underline")}>{uploadedFile.name}</a>
                                    </span>
                                    <button className={tailwindWrapper("text-red-500")} onClick={removeImage}>
                                        <CrossIcon dimension={"w-6 h-6"}/>
                                    </button>
                                </div>
                            )}
                    </div>
                )}
                <button type="button" className={tailwindWrapper(`flex justify-content gap-1  my-5 rounded-md ${themeText[theme]} ${themeBg[theme]} text-md text-white font-bold inline-block py-2 pl-5 pr-6 rounded-md focus:outline-none focus:shadow-outline mr-0 ml-auto ${(!query || !app || !subject) && "cursor-not-allowed opacity-50"}`)} disabled={!query || !app || !subject} 
                onClick={handleSubmit}>
                    <SubmitIcon />
                    <span>Submit</span>
                </button>
                </form>
            </div>
        </div>
    )}
  
const mapStateToProps = (state) => {
  return {
    paginationIndex: state.paginationIndex,
    appList: state.appList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    AddIssue: (data, index, status, successCallBack, errCallback) => {
      dispatch(addIssue(data, index, status, successCallBack, errCallback))
    },
    SetAppList: () => {
      dispatch(setAppList())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddQuery)
