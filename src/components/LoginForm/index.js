import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showErrorMsg: false, error: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, error: errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {username, password, showErrorMsg, error} = this.state

    return (
      <div className="bg-container">
        <div className="inner-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <div>
            <form onSubmit={this.onSubmitForm}>
              <div className="input-bar">
                <label htmlFor="username" className="label">
                  USERNAME
                </label>
                <input
                  type="text"
                  id="username"
                  className="input"
                  onChange={this.onChangeUsername}
                  value={username}
                />
              </div>
              <div className="input-bar">
                <label htmlFor="password" className="label">
                  PASSWORD
                </label>
                <input
                  type="password"
                  id="password"
                  className="input"
                  onChange={this.onChangePassword}
                  value={password}
                />
              </div>
              <button className="button" type="submit">
                Login
              </button>
              {showErrorMsg && <p className="error">*{error}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
