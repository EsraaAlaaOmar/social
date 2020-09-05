import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE,UPDATE_PROFILE, GET_PROFILES } from "../actions/types"

const initialState ={
    profile: null,
    profiles: [],
    ropes:[],
    loading: true,
    error:{}
}
export default function(state = initialState, action) {
    const {type, payload} = action 
    switch(type){
        case GET_PROFILE:
        case UPDATE_PROFILE:    
            return{
                ...state,
                profile:payload,
                loading: false
            }
        case GET_PROFILES:
            return{
                ...state,
                profiles:payload,
                loaing : false
            }    
        case PROFILE_ERROR: 
            return{
                ...state,
                error:payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return{
                ...state,
                profile:null,
                ropes:[],
                loading: false
            }    
         
        default:
            return state    
     
    }
}