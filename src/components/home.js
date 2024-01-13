import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Dropdown from './dropdown'
import { OtherApp } from './icons'
import Accordion from './accordion'
import SearchBar from './searchbar'
import { getTheme } from 'formula_one'
import { setAppList } from '../actions'
import { faqText } from '../constants/faqText'
import { themeBg, themeBorder } from '../constants/theme'
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"

const Home = ({ appList, SetAppList }) => {
    const [selectedApp, setApp] = useState(null)
    const [open, setOpen] = useState(false)
    const theme = getTheme()
    
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

    useEffect(() => {
        if (!appList.isLoaded)
            SetAppList()
    }, [appList.isLoaded, SetAppList])
    
    return (
        <div>
            <div> 
                <div className={tailwindWrapper("flex justify-between")}>
                    <SearchBar />
                    <Link to="/helpcentre/issues" className={tailwindWrapper("mt-auto")}>
                        <button className={tailwindWrapper(`text-white text-sm h-max rounded-md px-6 py-2.5 ${themeBg[theme]}`)}>
                        Report Issue
                        </button>
                    </Link>
                </div>
            </div>
            <div className={tailwindWrapper("flex flex-col md:flex-row justify-between h-full mt-12 px-4")}>
                <div className={tailwindWrapper("md:w-2/3")}>
                    <Dropdown options={options} selectedOption={selectedApp} setOption={setApp} open={open} setOpen={setOpen} width={"w-full"} otherContent={OtherApp} placeholder={"Select an App"}/>
                    <Accordion faqText={faqText} />
                </div>
                <div>
                    blogs
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
  return {
    appList: state.appList,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    SetAppList: () => {
          dispatch(setAppList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
