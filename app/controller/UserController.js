class UserController {
  #service

  constructor (service) {
    this.#service = service

    this.getUser = this.getUser.bind(this)
    this.createUser = this.createUser.bind(this)
    this.createAuthentication = this.createAuthentication.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  async createUser (req, res, next) {
    try {
      await this.#service.createUser(req.body)

      return res.json(201, {
        status: 'success',
        message: 'User created successfully'
      })
    } catch (err) {
      next(err)
    }
  }

  async createAuthentication (req, res, next) {
    try {
      const { email, password } = req.body
      const user = await this.#service.createAuthentication(email, password)

      return res.json({
        status: 'success',
        data: {
          token: user
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async updateUser (req, res, next) {
    try {
      const { id: userId } = req.params
      const { name, email, password } = req.body
      await this.#service.updateUser(userId, { name, email, password })

      return res.json({
        status: 'success',
        message: 'User updated sucessfully'
      })
    } catch (err) {
      next(err)
    }
  }

  async getUser (req, res, next) {
    try {
      const { id: userId } = req.params
      let user

      if (!userId) {
        user = await this.#service.getUser()
      } else {
        user = await this.#service.getUser(userId)
      }

      return res.json({
        status: 'success',
        data: (userId ? { user } : { users: user })
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController
