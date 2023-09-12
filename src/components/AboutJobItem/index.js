import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'

import './index.css'

class AboutJobItem extends Component {
  state = {jobDetails: [], similarJobs: []}

  componentDidMount() {
    this.getJobData()
  }

  updateJobDetailsData = job => ({
    companyLogoUrl: job.company_logo_url,
    companyWebsiteUrl: job.company_website_url,
    employmentType: job.employment_type,
    id: job.id,
    jobDescription: job.job_description,
    skills: job.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    lifeAtCompany: {
      description: job.life_at_company.description,
      imageUrl: job.life_at_company.image_url,
    },
    location: job.location,
    rating: job.rating,
    packagePerAnnum: job.package_per_annum,
  })

  updateSimilarJobsData = similarJob => ({
    companyLogoUrl: similarJob.company_logo_url,
    employmentType: similarJob.employment_type,
    id: similarJob.id,
    jobDescription: similarJob.job_description,
    location: similarJob.location,
    rating: similarJob.rating,
    title: similarJob.title,
  })

  getJobData = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    console.log(url)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    console.log(options)

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    const jobDetailsData = data.job_details
    const similarJobsData = data.similar_jobs

    const updatedJobDetails = this.updateJobDetailsData(jobDetailsData)

    const updatedSimilarJobs = similarJobsData.map(eachJob =>
      this.updateSimilarJobsData(eachJob),
    )

    this.setState({
      jobDetails: updatedJobDetails,
      similarJobs: updatedSimilarJobs,
    })
  }

  renderJobDetails = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      jobDescription,
      packagePerAnnum,
      skills,
    } = jobDetails
    console.log(skills)

    return (
      <div className="job-item">
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
        <div>
          <h1>Skills</h1>
          <ul>
            <li>skills</li>
          </ul>
        </div>
        <div>
          <div>
            <h1>Life at Company</h1>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {similarJobs} = this.state
    console.log(similarJobs)
    return (
      <>
        <Header />
        <div className="about-job-bg-container">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default AboutJobItem
