import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import Spinner from '../layout/spinner'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import {getProfileByID} from '../../actions/profile'


const Profile = ({getProfileByID,
    profile: { profile,loading },
auth,
match
})=> { useEffect(()=>{
getProfileByID(match.params.id)
    },[ getProfileByID , match.params.id ])
    return (
        <Fragment>
            {profile === null || loading ? <Spinner />: <Fragment> 
                <Link to='/profiles' className='btn btn-light'>
                Back To Profiles
                </Link>
                {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (<Link to='/edit-profile' className='btn btn-dark'>
                    Edit Profile
                </Link>)}
                <div class="profile-grid my-1">
                    <ProfileTop profile={profile} />
                    <ProfileAbout  profile={profile} />
                    <div class="profile-exp bg-white p-2">
                    <h2 class="text-primary">Experience</h2>
                    {profile.experience.length > 0 ? (<Fragment>
                        {profile.experience.map(experience => (
                        <ProfileExperience key={experience._id} experience={experience} />
                    ))}
                        
                       
                    </Fragment>):(<h4>no experience credentials</h4>)}
                     </div>
                    <div class="profile-edu bg-white p-2">
                    <h2 class="text-primary">Education</h2>
                    {profile.education.length > 0 ? (<Fragment>
                        {profile.education.map(edu => (
                        <ProfileEducation key={edu._id} education={edu} />
                    ))}
                     </Fragment>):(<h4>no education credentials</h4>)}
                    </div>
                </div>

                </Fragment>}
        </Fragment>
    )
}

Profile.propTypes = {
getProfileByID:PropTypes.func.isRequired,
auth: PropTypes.object.isRequired,
profile : PropTypes.object.isRequired,
}
const mapStateToProps= state =>({
profile:state.profile,
auth:state.auth
})
export default connect(mapStateToProps, {getProfileByID})(Profile)
