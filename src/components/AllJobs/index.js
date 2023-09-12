import {Component} from 'react'
import Cookies from 'js-cookie'
import {FiSearch} from 'react-icons/fi'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jwtToken = Cookies.get('jwt_token')

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    apiStatus: apiConstants.initial,
    profileDetails: {},
    jobsList: [],
    apiJobsStatus: apiConstants.initial,
    searchInput: '',
    activeCheckBoxList: [],
    activeSalaryRangeId: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getAllJobs()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    if (response.ok === true) {
      const profileDetailsData = data.profile_details
      const updatedData = {
        name: profileDetailsData.name,
        profileImageUrl: profileDetailsData.profile_image_url,
        shortBio: profileDetailsData.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  getAllJobs = async () => {
    this.setState({apiJobsStatus: apiConstants.inProgress})
    const {searchInput, activeCheckBoxList, activeSalaryRangeId} = this.state
    const type = activeCheckBoxList.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&minimun_package=${activeSalaryRangeId}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const {jobs} = data
      const updatedJobsData = jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobsList: updatedJobsData,
        apiJobsStatus: apiConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiConstants.failure})
    }
  }

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="name">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderTypesOfEmployment = () => (
    <ul className="options-list">
      {employmentTypesList.map(eachItem => (
        <li className="option-item" key={eachItem.label}>
          <input
            type="checkbox"
            id={eachItem.employmentTypeId}
            className="salary-checkbox"
            onClick={this.onClickCheckbox}
          />
          <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  renderSalaryRange = () => (
    <ul className="options-list">
      {salaryRangesList.map(eachItem => (
        <li className="option-item" key={eachItem.label}>
          <input
            type="radio"
            id={eachItem.salaryRangeId}
            className="salary-checkbox"
            name="option"
            onClick={this.onClickSalaryRange}
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    console.log(jobsList)
    const noOfJobs = jobsList.length > 0

    return noOfJobs ? (
      <>
        <ul>
          {jobsList.map(eachJob => (
            <JobItem key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </>
    ) : (
      <>
        <div className="no-jobs-bg">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs"
          />
          <h1 className="no-jobs-h1">No jobs found</h1>
          <p className="no-jobs-p">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      </>
    )
  }

  onLoading = () => (
    <div data-testid="loader" className="no-jobs-bg">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getAllJobs()
  }

  onClickCheckbox = event => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getAllJobs)
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getAllJobs,
      )
    }
  }

  onClickSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getAllJobs)
  }

  onFailureProfileView = () => (
    <>
      <h1>profile fail</h1>
      <button type="button" onClick={this.onClickRetryProfile}>
        Retry
      </button>
    </>
  )

  onFailureJobsView = () => (
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

  onClickRetryProfile = () => this.renderProfileDetails()

  onClickRetryJobs = () => this.getAllJobs()

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getAllJobs()
    }
  }

  onRenderProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.onLoading()
      case apiConstants.failure:
        return this.onFailureJobsView()
      case apiConstants.success:
        return this.renderProfileDetails()
      default:
        return null
    }
  }

  onRenderJobs = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiConstants.inProgress:
        return this.onLoading()
      case apiConstants.failure:
        return this.onFailureProfileView()
      case apiConstants.success:
        return this.renderJobsList()
      default:
        return null
    }
  }

  render() {
    const {profileDetails, searchInput} = this.state
    console.log(profileDetails)

    return (
      <>
        <Header />
        <div className="about-job-bg">
          <div className="bg-jobs-container">
            <div className="bg-container-1">
              {this.onRenderProfile()}
              <hr />
              <div className="options-container">
                <h1 className="options-heading">Type of Employment</h1>
                {this.renderTypesOfEmployment()}
              </div>
              <hr />
              <div className="options-container">
                <h1 className="options-heading">Salary Range</h1>
                {this.renderSalaryRange()}
              </div>
            </div>
            <div className="bg-container-2">
              <div className="search-bar">
                <input
                  type="search"
                  value={searchInput}
                  className="search"
                  placeholder="Search"
                  onChange={this.onChangeSearch}
                  onKeyDown={this.onEnterSearchInput}
                />
                <button
                  type="button"
                  className="search-button"
                  onClick={this.onClickSearch}
                >
                  <FiSearch className="search-icon" />
                </button>
              </div>
              <div>{this.onRenderJobs()}</div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
