import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="bg-container-home">
      <div className="inner-container-home">
        <h1 className="main-heading">
          Find The Job That <br />
          Fits Your Life
        </h1>
        <p className="intro">
          Millions of people are searching for jobs, salary
          <br /> information, company reviews. Find the job that fits your{' '}
          <br />
          abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="find-jobs-button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default Home
