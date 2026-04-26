"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const BooksRepository_1 = require("./repositories/BooksRepository");
const BooksController_1 = require("./controllers/BooksController");
const container = new inversify_1.Container();
exports.container = container;
// Регистрация репозиториев
container.bind(BooksRepository_1.BooksRepository).toSelf();
// Регистрация контроллеров
container.bind(BooksController_1.BooksController).toSelf();
//# sourceMappingURL=container.js.map