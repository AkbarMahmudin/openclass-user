const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const { generateToken } = require('../utils/token/TokenManager')
const NotfoundError = require('../utils/exceptions/NotFoundError')
const ConflictError = require('../utils/exceptions/ConflictError')
const AuthenticationError = require('../utils/exceptions/AuthenticationError')

class UserService {
  #prisma
  constructor () {
    this.#prisma = new PrismaClient()

    this.createUser = this.createUser.bind(this)
    this.createAuthentication = this.createAuthentication.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  async createUser (payload) {
    const { name, email, password } = payload
    const user = await this.#prisma.user.create({
      data: {
        name, email, password: bcrypt.hashSync(password, 10)
      }
    })

    return user
  }

  async createAuthentication (email, password) {
    const user = await this.#prisma.user.findFirst({
      where: { email }
    })

    if (!user) {
      throw new AuthenticationError('Invalid Credential')
    }

    const matchPass = bcrypt.compareSync(password, user.password)
    if (!matchPass) {
      throw new AuthenticationError('Invalid Credential')
    }

    const token = generateToken({
      userId: user.id,
      name: user.name,
      email: user.email
    })

    return token
  }

  async updateUser (userId, payload) {
    try {
      const user = await this.#prisma.user.findUnique({
        where: { id: Number(userId) }
      })

      if (!user) {
        throw new NotfoundError('User not found')
      }

      const userUpdated = await this.#prisma.user.update({
        where: { id: Number(userId) },
        data: {
          ...payload,
          ...(payload.password) && { password: bcrypt.hashSync(payload.password, 10) }
        }
      })

      return userUpdated
    } catch (err) {
      if (err.code === 'P2002') throw new ConflictError('User email already exist')
    }
  }

  async getUser (userId = null) {
    let user
    const attr = {
      select: {
        id: true,
        name: true,
        email: true
      }
    }
    if (!userId) {
      user = await this.#prisma.user.findMany({
        ...attr
      })
    } else {
      user = await this.#prisma.user.findUnique({
        where: { id: Number(userId) },
        ...attr
      })
      if (!user) throw new NotfoundError('User not found')
    }

    return user
  }
}

module.exports = UserService
