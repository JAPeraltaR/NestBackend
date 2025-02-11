import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    _id?:       string;

    @Prop({ required: true })
    name:       string;

    @Prop({ required: true })
    lastName:   string;

    @Prop({ unique: true, required: true })
    email:      string;

    @Prop()
    tel:        string;
    
    @Prop({ required: true })
    cel:        string;

    @Prop({ required: true })
    user:       string;

    @Prop({ minlength: 6, required: true })
    pass?:      string;

    @Prop({ default: true })
    isActive:   boolean;

    @Prop({ type: [String], default: ['user']})
    roles:      string[];

}

export const UserSchema= SchemaFactory.createForClass( User )