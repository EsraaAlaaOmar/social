import axios from 'axios'

const setAuthToken = token => {
    if(token){
        axios.defaults.headers.common['e'] = token
    } else {
        delete axios.defaults.headers.common['e']
    }
}
export default setAuthToken