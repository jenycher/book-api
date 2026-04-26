"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const User_model_1 = require("../models/User.model");
const PasswordService_1 = require("../services/PasswordService");
let UserRepository = class UserRepository {
    async createUser(user) {
        const hashedPassword = await PasswordService_1.PasswordService.hash(user.password);
        const newUser = new User_model_1.UserModel({
            id: (0, uuid_1.v4)(),
            ...user,
            password: hashedPassword,
            createdAt: new Date(),
            lastLogin: null
        });
        await newUser.save();
        return newUser.toObject();
    }
    async getUserById(id) {
        const user = await User_model_1.UserModel.findOne({ id });
        return user ? user.toObject() : null;
    }
    async getUserByEmail(email) {
        const user = await User_model_1.UserModel.findOne({ email: email.toLowerCase() });
        return user ? user.toObject() : null;
    }
    async getUserByUsername(username) {
        const user = await User_model_1.UserModel.findOne({ username });
        return user ? user.toObject() : null;
    }
    async updateLastLogin(id) {
        const user = await User_model_1.UserModel.findOneAndUpdate({ id }, { lastLogin: new Date() }, { new: true });
        return user ? user.toObject() : null;
    }
    async comparePassword(user, candidatePassword) {
        return PasswordService_1.PasswordService.compare(candidatePassword, user.password);
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)()
], UserRepository);
//# sourceMappingURL=UserRepository.js.map