const express = require('express')
const Employee = require('../model/employee')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/employee', async(req, res) => {
    const employee = new Employee(req.body)
    try {
      await employee.save()
      const token = await employee.generateAuthToken()
      res.status(201).send({ employee, token })
    } catch (error) {
      res.status(400).send(error)
    }
  })
  
router.post('/employee/login', async(req, res) => {
  try {
    const employee = await Employee.findByCredentials(req.body.email, req.body.password)
    const token = await employee.generateAuthToken()
    //res.status(201).send({ employee, token })
    res.status(201).send({ employee: employee.getPublicProfile(), token })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/employee/logout', auth, async(req, res) => {
  try {
    req.employee.tokens = req.employee.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.employee.save()
    res.status(201).send()
  } catch (error) {
    res.status(500).send()
  }
})
  
router.post('/employee/logoutAll', auth, async(req, res) => {
  try {
    req.employee.tokens = []
    await req.employee.save()
    res.status(201).send()
  } catch (error) {
    res.status(500).send()
  }
})

router.get('/employee/me', auth, async(req, res) => {
  res.send(req.employee)
})
  

  router.patch('/employee/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'department', 'password', 'salary']
    const isValidOperation = updates.every((update) => {
      allowedUpdates.includes(update)
    })
  
    if(isValidOperation) {
      return res.status(400).send({error: 'invalid updates !'})
    }
  
    try {
      updates.forEach((update) => {
        req.employee[update] = req.body[update]
      })
      await req.employee.save()
      res.status(201).send(req.employee)
    } catch (error) {
      res.status(500).send(e)
    }
  })

  
  router.delete('/employee/me', auth, async(req, res) => {
  
    try {
      await req.employee.remove()
      res.status(201).send(req.employee)
    } catch (error) {
      res.status(500).send(error)
    }
  })
  
module.exports = router  
