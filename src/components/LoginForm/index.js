import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderUsername = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="name" className="label">
          Username
        </label>
        <input
          type="text"
          value={username}
          id="name"
          placeholder="Username"
          onChange={this.onChangeUsername}
          className="input"
        />
      </>
    )
  }

  renderPassword = () => {
    const {password} = this.state

    return (
      <>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={this.onChangePassword}
          className="input"
          value={password}
        />
      </>
    )
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({showError: true, errorMsg})
  }

  submitForm = async event => {
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
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <>
        <div className="login-app-container">
          <div className="image-container">
            <img
              src="https://res.cloudinary.com/dofzu13gt/image/upload/v1660705174/Layer_2_1_jectew.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <form className="form-container" onSubmit={this.submitForm}>
            <div className="login-sub-container">
              <div className="logo-container">
                <img
                  src="https://res.cloudinary.com/dofzu13gt/image/upload/v1660533817/Standard_Collection_8_c4f1te.png"
                  alt="website logo"
                  className="logo"
                />
                <h1 className="heading">Insta Share</h1>
              </div>
              <div className="input-main-container">
                <div className="input-container">{this.renderUsername()}</div>
                <div className="input-container">{this.renderPassword()}</div>
                {showError && <p className="error-msg">*{errorMsg}</p>}
                <button type="submit" className="submit-btn">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    )
  }
}

export default LoginForm
