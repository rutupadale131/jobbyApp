import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
    id,
  } = jobDetails

  return (
    <li className="job-item">
      <Link to={`/jobs/${id}`} className="link job-item">
        <div className="top-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="middle-container">
          <div className="location-employment">
            <div className="location">
              <MdLocationOn className="location-icon" />
              <p>{location}</p>
            </div>
            <div className="employment-type">
              <p>{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="description">Description</h1>
        <p>{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
