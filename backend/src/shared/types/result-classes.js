export class BadRequestException{
  constructor(message) {
    this.message = { error: message }
  }
}

export class UnauthorizedException {
  constructor(message) {
    this.message = { error: message }
  }
}

export class ConflictException {
  constructor(message) {
    this.message = { error: message }
  }
}

export class NotFoundException {
  constructor(message) {
    this.message = { error: message }
  }
}

export class InternalServerErrorException {
  constructor(message) {
    this.message = { error: message }
  }
}

export class BadGatewayException {
  constructor(message) {
    this.message = { error: message }
  }
}

export class ForbiddenException {
  constructor(message) {
    this.message = { error: message }
  }
}
