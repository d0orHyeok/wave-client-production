import * as S from './RegisterPage.style'
import * as regex from './regex'
import React, { useState } from 'react'
import TextField from '@components/Common/TextField'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '@redux/context/alertProvider'
import { userSignUp } from '@api/userApi'
import { Helmet } from 'react-helmet-async'
import CheckBox from '@components/Common/Checkbox'
import LoadingPage from '@components/Loading/LoadingPage'

const RegisterPage = () => {
  const navigate = useNavigate()
  const openAlert = useAlert()

  const [registerInput, setRegisterInput] = useState({
    username: '',
    password: '',
    passwordConfirmed: '',
    email: '',
    nickname: '',
  })
  // NORMAL: 0, ERROR: -1, VALIDATE: 1
  const [inputValidate, setInputValidate] = useState({
    username: 0,
    password: 0,
    passwordConfirmed: 0,
    email: 0,
    nickname: 0,
  })
  const [checkbox, setCheckbox] = useState({
    term1: false,
    term2: false,
  })
  const [loading, setLoading] = useState(false)

  const { username, password, passwordConfirmed, email, nickname } =
    registerInput

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.currentTarget
    setCheckbox({ ...checkbox, [id]: checked })
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget
    setRegisterInput({ ...registerInput, [id]: value })
    validationCheck(id, value.trim())
  }

  const validationCheck = (id: string, value: string) => {
    let validate = 0
    if (value.length) {
      switch (id) {
        case 'username':
          validate =
            regex.usernameRegex.test(value) &&
            !regex.notUsernameRegex.test(value)
              ? 1
              : -1
          break
        case 'password':
          validate = regex.passwordRegex.test(value) ? 1 : -1
          break
        case 'email':
          validate = regex.emailRegex.test(value) ? 1 : -1
          break
        case 'nickname':
          validate = regex.nicknameRegex.test(value) ? 1 : -1
          break
        case 'passwordConfirmed':
          validate = value === password ? 1 : -1
          break
      }
    }
    setInputValidate({ ...inputValidate, [id]: validate })
  }

  const handleClickRegister = async () => {
    // ??????????????? ????????? ????????? ???????????? ???????????? ??????????????? ??????

    // ????????? ????????? ???????????? ???????????? ????????? ????????? focus
    const validateEntries = Object.entries(inputValidate)
    const notValidateIndex = validateEntries.findIndex((validate) => {
      if (validate[0] === 'nickname') {
        return validate[1] === -1
      }
      return validate[1] !== 1
    })
    if (notValidateIndex !== -1) {
      const focusTargetId = validateEntries[notValidateIndex][0]

      document.getElementById(focusTargetId)?.focus()
      return setInputValidate({ ...inputValidate, [focusTargetId]: -1 })
    }

    const checkboxEntries = Object.entries(checkbox)
    const notCheckedIndex = checkboxEntries.findIndex(
      (checkbox) => checkbox[1] === false
    )

    // ??? ????????? ??????????????? ??????
    if (notCheckedIndex !== -1) {
      const focusTargetId = checkboxEntries[notCheckedIndex][0]

      document.getElementById(focusTargetId)?.focus()
      return alert(
        `${
          focusTargetId[0].toUpperCase() + focusTargetId.slice(1)
        } ????????? ??????????????????.`
      )
    }

    // ????????? ???????????? ??????
    const registerInfo = {
      username,
      password,
      email,
      nickname,
    }

    try {
      setLoading(true)
      await userSignUp(registerInfo)
      console.log('Register Success')
      navigate('/')
      openAlert('Successfully sign up ', { severity: 'success' })
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setRegisterInput({ ...registerInput, username: '' })
        setInputValidate({ ...inputValidate, username: -1 })
        document.getElementById('username')?.focus()
        alert('?????? ???????????? ??????????????????.')
      } else {
        alert('???????????? ??????')
      }
      console.error('Register Error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | Wave</title>
      </Helmet>
      {!loading ? <></> : <LoadingPage />}
      <S.Wrapper>
        <h1 className="register-title">Sign Up</h1>
        <S.InputArea>
          <TextField
            className="register-input"
            type="text"
            autoComplete="off"
            id="username"
            placeholder="ID*"
            value={username}
            onChange={handleChangeInput}
            success={inputValidate.username === 1}
            error={inputValidate.username === -1}
            errorText=""
          />
          <TextField
            className="register-input"
            type="password"
            autoComplete="off"
            id="password"
            placeholder="Password*"
            value={password}
            onChange={handleChangeInput}
            success={inputValidate.password === 1}
            error={inputValidate.password === -1}
            errorText="?????????, ????????? ????????? 6~20?????? ??????????????? ??????????????????"
          />
          <TextField
            className="register-input"
            type="password"
            autoComplete="off"
            id="passwordConfirmed"
            placeholder="Password Confirmed*"
            value={passwordConfirmed}
            onChange={handleChangeInput}
            success={inputValidate.passwordConfirmed === 1}
            error={inputValidate.passwordConfirmed === -1}
            errorText="??????????????? ???????????? ????????????."
          />
          <TextField
            className="register-input"
            type="text"
            autoComplete="off"
            id="email"
            placeholder="Email*"
            value={email}
            onChange={handleChangeInput}
            success={inputValidate.email === 1}
            error={inputValidate.email === -1}
            errorText="???????????? ?????? Email ?????????."
          />
          <TextField
            className="register-input"
            type="text"
            autoComplete="off"
            id="nickname"
            placeholder="Nickname"
            value={nickname}
            onChange={handleChangeInput}
            success={inputValidate.nickname === 1}
            error={inputValidate.nickname === -1}
            errorText="??????, ??????, _-, 2~20?????? ???????????? ??????????????????."
          />
          <S.TermBox className="register-term">
            <h2 className="register-term-title">Terms 1</h2>
            <div className="register-term-text">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit,
              sint tempora? Eligendi neque deleniti tempore architecto
              consequatur eius cum odit suscipit veniam! Natus molestiae
              laboriosam nobis ex! Delectus, eligendi! Rerum officia doloremque,
              repudiandae incidunt veniam id et nam soluta nemo provident
              voluptates at temporibus pariatur impedit eum suscipit, laborum
              non numquam quis eaque! Pariatur rerum quae ad distinctio nulla
              maiores ea? Eaque, suscipit. Obcaecati placeat at quas, aperiam
              maiores non quibusdam eligendi, quis omnis ad optio qui.
              Voluptatibus officiis ipsa, nostrum ipsum deleniti quam commodi
              impedit eos. Provident natus rerum delectus, nostrum pariatur
              sunt, consequatur quia, possimus enim blanditiis necessitatibus!
            </div>
            <CheckBox
              id="term1"
              className="term-checkbox"
              checked={checkbox.term1}
              onChange={handleChangeCheckbox}
              textsize={'0.9rem'}
              label={'???????????????'}
            />
          </S.TermBox>
          <S.TermBox className="register-term">
            <h2 className="register-term-title">Terms 2</h2>
            <div className="register-term-text">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit,
              sint tempora? Eligendi neque deleniti tempore architecto
              consequatur eius cum odit suscipit veniam! Natus molestiae
              laboriosam nobis ex! Delectus, eligendi! Rerum officia doloremque,
              repudiandae incidunt veniam id et nam soluta nemo provident
              voluptates at temporibus pariatur impedit eum suscipit, laborum
              non numquam quis eaque! Pariatur rerum quae ad distinctio nulla
              maiores ea? Eaque, suscipit. Obcaecati placeat at quas, aperiam
              maiores non quibusdam eligendi, quis omnis ad optio qui.
              Voluptatibus officiis ipsa, nostrum ipsum deleniti quam commodi
              impedit eos. Provident natus rerum delectus, nostrum pariatur
              sunt, consequatur quia, possimus enim blanditiis necessitatibus!
            </div>
            <CheckBox
              id="term2"
              className="term-checkbox"
              checked={checkbox.term2}
              onChange={handleChangeCheckbox}
              textsize={'0.9rem'}
              label={'???????????????'}
            />
          </S.TermBox>
          <S.RegisterButton
            className="register-button"
            onClick={handleClickRegister}
          >
            ????????????
          </S.RegisterButton>
        </S.InputArea>
      </S.Wrapper>
    </>
  )
}

export default React.memo(RegisterPage)
