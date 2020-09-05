import axios  from'axios'
import { setAlert } from './alert'
import {GET_PROFILE, GET_PROFILES, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED,CLEAR_PROFILE} from './types'

//get current useres profile
export const getCurrentProfile = () => async dispatch =>{
    try {
        const res= await axios.get('/api/profile/me')
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:e.response.statusText, status:e.response.status}
        })
    }
}
//Get All Profiles
export const getProfiles = () => async dispatch =>{
    dispatch({type: CLEAR_PROFILE})
    try {
        const res= await axios.get('/api/profile')
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:e.response.statusText, status:e.response.status}
        })
    }
}

//Get Profile by ID
export const getProfileByID = userId => async dispatch =>{
   
    try {
        const res= await axios.get(`/api/profile/user/${userId}`)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:e.response.statusText, status:e.response.status}
        })
    }
}

//create or update profile
export const createProfile =(formData, history, edit = false) => async dispatch =>{
    try {
        const config ={
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('api/profile',formData, config)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
        dispatch(setAlert(edit ? 'profile Updated' : 'Profile Created','SUCCESS'))
        if(!edit){
            history.push('/dashboard') //redirect
        }
    } catch (e) {
        const errors = e.response.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))}
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:e.response.statusText, status:e.response.status}
        })
    }
}
//add experience
export const addExperience =(formData,history) => async dispatch =>{
    try {
        const config ={
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('api/profile/experience',formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience add','success'))
            history.push('/dashboard') //redirect
        }
     catch (e) {
        const errors = e.response.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))}
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:e.response.statusText, status:e.response.status}
        })
    }
}


//add education
export const addEducation =(formData,history) => async dispatch =>{
    try {
        const config ={
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('api/profile/education',formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience add'),'success')
            history.push('/dashboard') //redirect
        }
     catch (e) {
        const errors = e.response.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))}
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:e.response.statusText, status:e.response.status}
        })
    }
}
//Delete experience 
export const deleteExperience = id=> async dispatch =>{
    try {
        const res= await axios.delete(`/api/profile/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Experience Removed', 'success'))
    } catch (e) {
        const errors = e.response.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))}

    }
}
 //
 export const deleteEducation = id=> async dispatch =>{
    try {
        const res= await axios.delete(`/api/profile/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Education Removed', 'success'))
    } catch (e) {
        const errors = e.response.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))}

    }
}

//Delete Account 
export const deleteAccount = id=>async dispatch=>{
    if(window.confirm('Are you Sure? This can Not be undone!')) {
        try {
       await axios.delete(`/api/profile`)
        dispatch({ type: CLEAR_PROFILE })
        dispatch({ type: ACCOUNT_DELETED })
        dispatch(setAlert('Your account has been permenantly deleted ', 'success'))
    } catch (e) {
        const errors = e.response.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))}
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg:e.response.statusText, status:e.response.status}
            })
    }}
}

