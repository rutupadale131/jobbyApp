import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

import Loader from 'react-loader-spinner'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AboutJobItem extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: [],
    similarJobDetails: [],
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const optionsData = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, optionsData)

    if (response.ok === true) {
      const fetchedJobData = await response.json()
      const updatedJobDetailsData = [fetchedJobData.job_details].map(job => ({
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
        title: job.title,
      }))

      const updatedSimilarJobsData = fetchedJobData.similar_jobs.map(
        similarJob => ({
          companyLogoUrl: similarJob.company_logo_url,
          employmentType: similarJob.employment_type,
          id: similarJob.id,
          jobDescription: similarJob.job_description,
          location: similarJob.location,
          rating: similarJob.rating,
          title: similarJob.title,
        }),
      )

      console.log(updatedSimilarJobsData)
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedJobDetailsData,
        similarJobDetails: updatedSimilarJobsData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobDetails, apiStatus} = this.state
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
    console.log(jobDetails)
    console.log(apiStatus)

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
            {skills.map(eachSkill => (
              <li key={eachSkill.name}>
                <p>{eachSkill.name}</p>
              </li>
            ))}
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

  renderJobDetailsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.pnghttps://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onClickRetryJobs}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="no-jobs-bg">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderPageView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailureView()
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      default:
        return null
    }
  }

  render() {
    const {jobDetails, similarJobDetails} = this.state

    console.log(jobDetails)
    console.log(similarJobDetails)
    return <div>{this.renderPageView()}</div>
  }
}

export default AboutJobItem
