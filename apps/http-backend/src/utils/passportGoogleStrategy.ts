import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AppConfig } from "../config";
import { logger } from "@repo/shared-utils";
import { createNewGoogleUser } from "../services/userDbServices";

const PassportGoogleStrategy = new GoogleStrategy(
  {
    clientID: AppConfig.get("GOOGLE_CLIENT_ID") as string,
    clientSecret: AppConfig.get("GOOGLE_CLIENT_SECRET") as string,
    callbackURL: "http://localhost:4000/api/v1/auth/google/callback",
  },
  async (_, __, profile, done) => {
    try {
      const email = profile._json?.email;

      if (!email) {
        console.log("Error in passport");
        return done(new Error("No email found from google"));
      }

      // console.log(profile);
      const username = email.split("@")[0];

      if (!username) {
        return done(new Error("No username found from email"));
      }

      const user = await createNewGoogleUser(
        email,
        profile.displayName,
        username,
        profile.photos?.[0]?.value || "",
        profile.id
      );

      // await prisma.user.upsert({
      //   where: {
      //     email,
      //   },
      //   update: {
      //     lastLoginAt: new Date(),
      //   },
      //   create: {
      //     email,
      //     name: profile.displayName,
      //     avatar: profile.photos?.[0]?.value,
      //     authProvider: "GOOGLE",
      //     providerId: profile.id,
      //     isVerified: true,
      //     lastLoginAt: new Date(),
      //     username,
      //   },
      // });

      return done(null, user);
    } catch (error) {
      logger.error("Error in passport google strategy", {
        meta: {
          error,
        },
      });
      return done(error);
    }
  }
);

export default PassportGoogleStrategy;
