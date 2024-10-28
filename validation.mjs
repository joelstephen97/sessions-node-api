// validation.mjs
import Joi from 'joi';

const createSessionSchema = Joi.object({
  playerName: Joi.string().min(1).required(),
});

const joinSessionSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
  playerName: Joi.string().min(1).optional(),
});

const changePlayerNameSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
  playerId: Joi.string().uuid().required(),
  newPlayerName: Joi.string().min(1).required(),
});

const updateOperatorsSchema = Joi.object({
  playerId: Joi.string().uuid().required(),
  attackers: Joi.required(),
  defenders: Joi.required(),
});

export {
  createSessionSchema,
  joinSessionSchema,
  changePlayerNameSchema,
  updateOperatorsSchema,
};
