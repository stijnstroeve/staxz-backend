import * as mongoose from "mongoose";
import {Error} from "../../Error/Error";
import {ErrorType} from "../../Error/ErrorType";

export interface IReward extends mongoose.Document {
    name: string,
    description: string,
    date_updated: Date,
    date_created: Date
}

export interface IRewardFunctions extends mongoose.Model<IReward> {
    listRewards(): Promise<IReward[]>;
    createReward(name: string, description: string): Promise<IReward>;
}

export const RewardSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    date_updated: {type: Date, default: Date.now},
    date_created: {type: Date, default: Date.now}
});

RewardSchema.pre<IReward>('save', function(next) {
    this.date_updated = new Date(Date.now());
    next();
});

RewardSchema.statics.createReward = function(name: string, description: string): Promise<IReward> {
    return new Promise<IReward>((resolve, reject) => {
        const reward = new Reward({
            name: name,
            description: description
        });

        reward.save((error: any, reward: IReward) => {
            if(error) return reject(new Error(ErrorType.ERROR_SAVING_REWARD, error));

            //Make sure __v gets removed.
            reward.__v = undefined;

            return resolve(reward);
        });
    })
};

RewardSchema.statics.listRewards = function(): Promise<IReward[]> {
    return new Promise<IReward[]>((resolve, reject) => {
        Reward.find({}, (error: any, rewards: IReward[]) => {
            if(error) return reject(new Error(ErrorType.UNKNOWN, error));

            let rewardsToSend: any[] = [];
            rewards.forEach((reward: IReward) => {
                rewardsToSend.push({
                    name: reward.name,
                    description: reward.description,
                    date_updated: reward.date_updated,
                    date_created: reward.date_created
                });
            });

            resolve(rewardsToSend);
        });
    })
};

const Reward = mongoose.model<IReward, IRewardFunctions>("Reward", RewardSchema);

export default Reward;