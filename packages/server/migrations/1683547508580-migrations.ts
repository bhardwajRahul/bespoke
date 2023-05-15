import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1683547508580 implements MigrationInterface {
  name = 'Migrations1683547508580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."billing_billingsubscriptionstatus_enum" AS ENUM('unsubscribed', 'active', 'past_due', 'incomplete', 'canceled', 'incomplete_expired', 'unpaid', 'trialing')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."billing_billingsubscriptionentity_enum" AS ENUM('stripe', 'shopify')`,
    );
    await queryRunner.query(
      `CREATE TABLE "billing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "billingSubscriptionStatus" "public"."billing_billingsubscriptionstatus_enum" NOT NULL DEFAULT 'unsubscribed', "billingSubscriptionEntity" "public"."billing_billingsubscriptionentity_enum", "currentPeriodEnd" TIMESTAMP WITH TIME ZONE, "cancelAtPeriodEnd" boolean NOT NULL DEFAULT false, "subscriptionId" character varying, "contactsQuantity" integer NOT NULL DEFAULT '250', "emailSendQuantity" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_d9043caf3033c11ed3d1b29f73c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."item_category_type_enum" AS ENUM('SHOP')`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."item_category_type_enum" NOT NULL, CONSTRAINT "PK_91ba90f150e8804bdaad7b17ff8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."item_type_enum" AS ENUM('EMAIL_TEMPLATE', 'SIGNUP_FORM', 'CREDITS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "credits" integer, "imageData" jsonb NOT NULL, "description" character varying, "data" jsonb NOT NULL, "type" "public"."item_type_enum" NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "itemCategoryId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "store_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "storeId" uuid NOT NULL, "itemId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "creditId" uuid, CONSTRAINT "REL_0fbd166b61190fb6f19d079bf7" UNIQUE ("creditId"), CONSTRAINT "PK_d8d520cf8af78e9dd5bc47943c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "credit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "storeId" uuid NOT NULL, "credited" integer NOT NULL DEFAULT '0', "debited" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c98add8e192ded18b69c3e345a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shopify" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "listIdToCollectEmail" uuid, "storeUrl" character varying NOT NULL, "productSyncJobId" text, "customerSyncJobId" text, "authenticated" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_100ad612b6b8742f478791e4b1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "integration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shopifyId" uuid, CONSTRAINT "REL_e37748bf2b10b8be30849bde8d" UNIQUE ("shopifyId"), CONSTRAINT "PK_f348d4694945d9dc4c7049a178a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "listId" uuid NOT NULL, "postId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1df5a96655897c913cb0c35e2b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_producttype_enum" AS ENUM('SERVICE', 'PHYSICAL_PRODUCT', 'DIGITAL_PRODUCT', 'EXTERNAL_LINK')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_productsource_enum" AS ENUM('WEB', 'SHOPIFY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "productType" "public"."product_producttype_enum" NOT NULL DEFAULT 'EXTERNAL_LINK', "price" integer NOT NULL DEFAULT '0', "productData" jsonb, "productSource" "public"."product_productsource_enum" NOT NULL, "image" jsonb, "description" character varying, "rank" character varying NOT NULL, "externalLink" character varying, "hidden" boolean NOT NULL DEFAULT false, "storeId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "nodeKey" character varying NOT NULL, "postId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1e6c8ac2c85637ca875eca3180f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_poststate_enum" AS ENUM('DRAFT', 'PUBLISHED', 'UN_PUBLISHED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_posttype_enum" AS ENUM('POST', 'AUTOMATION')`,
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "subTitle" character varying, "bodyLexical" character varying, "postHandle" character varying, "bodyHTML" character varying, "postState" "public"."post_poststate_enum" NOT NULL DEFAULT 'DRAFT', "postType" "public"."post_posttype_enum" NOT NULL DEFAULT 'POST', "publishedDate" TIMESTAMP WITH TIME ZONE, "storeId" uuid NOT NULL, "image" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."signup_form_formstate_enum" AS ENUM('DRAFT', 'LIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "signup_form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "formState" "public"."signup_form_formstate_enum" NOT NULL, "scriptModule" character varying, "scriptJavascript" character varying, "form" jsonb, "success" jsonb, "storeId" uuid NOT NULL, "listId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_556f3b28fd4237daa5775d17a4d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriber_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "listId" uuid NOT NULL, "subscriberId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "emailConcentId" uuid, CONSTRAINT "REL_bf7bd8797231d19970bc3d377d" UNIQUE ("emailConcentId"), CONSTRAINT "PK_f2df8f7d0d99edb3ae5661aaa44" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."email_concent_state_enum" AS ENUM('SUBSCRIBED', 'UNSUBSCRIBED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."email_concent_optinlevel_enum" AS ENUM('SINGLE_OPT_IN', 'SINGLE_OPT_IN_WITH_NOTIFICATION', 'CONFIRMED_OPT_IN')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."email_concent_collectedfrom_enum" AS ENUM('SIGNUP_FORM', 'LANDING_PAGE', 'IMPORT', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_concent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state" "public"."email_concent_state_enum" NOT NULL, "optInLevel" "public"."email_concent_optinlevel_enum" NOT NULL, "collectedFrom" "public"."email_concent_collectedfrom_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bf5544d860c10ac21f717a864f7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_eventtype_enum" AS ENUM('SHOPIFY_PRODUCT_SYNC', 'SHOPIFY_CUSTOMER_SYNC', 'SHOPIFY_PRODUCT_SYNC_PROGRESS', 'SHOPIFY_CUSTOMER_SYNC_PROGRESS', 'SHOPIFY', 'SUBSCRIBER', 'INTEGRATION', 'SUBSCRIBER_LIST', 'USER', 'LIST', 'STORE', 'POST', 'PRODUCT', 'SIGNUP_FORM', 'WORKFLOW', 'STORE_CHALLENGE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_eventstate_enum" AS ENUM('ACTIVE', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_eventaccessrestriction_enum" AS ENUM('HIGH', 'MEDIUM', 'LOW')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventType" "public"."event_eventtype_enum" NOT NULL, "message" character varying NOT NULL, "link" character varying, "eventState" "public"."event_eventstate_enum" NOT NULL, "eventAccessRestriction" "public"."event_eventaccessrestriction_enum" NOT NULL, "eventProducerId" uuid NOT NULL, "showAsNotification" boolean NOT NULL DEFAULT false, "notificationDismissed" boolean NOT NULL DEFAULT false, "notificationRead" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying, "stripeCustomerId" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "storeId" uuid, "userEmailDeliveryStatusId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_e1352f3eacfce12c2b7bcc5b9f" UNIQUE ("storeId"), CONSTRAINT "REL_cb05b4115235acbc219cbb647a" UNIQUE ("userEmailDeliveryStatusId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_email_delivery_status_emaildeliverystatus_enum" AS ENUM('SUBSCRIBED', 'BOUNCED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_email_delivery_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "emailDeliveryStatus" "public"."user_email_delivery_status_emaildeliverystatus_enum" NOT NULL DEFAULT 'SUBSCRIBED', "softBounceCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_18eb643ef8de5c8845bfb25c163" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscriber_subscribertype_enum" AS ENUM('Author', 'Free')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscriber_emailstatus_enum" AS ENUM('SUBSCRIBED', 'UNSUBSCRIBED', 'MARKED_AS_SPAM')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriber" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subscriberType" "public"."subscriber_subscribertype_enum" NOT NULL DEFAULT 'Free', "firstName" text, "lastName" text, "storeId" uuid NOT NULL, "userId" uuid NOT NULL, "phoneNumber" text, "emailStatus" "public"."subscriber_emailstatus_enum" NOT NULL DEFAULT 'SUBSCRIBED', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "subscriberAddressId" uuid, CONSTRAINT "REL_4e2a08770681d650906e2ee3bc" UNIQUE ("subscriberAddressId"), CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriber_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address1" text, "address2" text, "city" text, "country" text, "state" text, "zipCode" text, CONSTRAINT "PK_97004c73e89f8bab44498c8fcdb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."metric_metrictype_enum" AS ENUM('SHOPIFY_ORDERED_PRODUCT', 'SHOPIFY_REFUNDED_ORDER', 'SHOPIFY_PLACED_ORDER', 'SHOPIFY_CHECKOUT_STARTED', 'SHOPIFY_FULFILLED_ORDER', 'SHOPIFY_CANCELLED_ORDER', 'SHOPIFY_CANCELLED_ORDER_VALUE', 'SHOPIFY_CHECKOUT_STARTED_VALUE', 'SHOPIFY_FULFILLED_ORDER_VALUE', 'SHOPIFY_ORDERED_PRODUCT_VALUE', 'SHOPIFY_PLACED_ORDER_VALUE', 'SHOPIFY_REFUNDED_ORDER_VALUE', 'EMAIL_OPENED', 'EMAIL_DELIVERED', 'EMAIL_SENT', 'EMAIL_LINK_CLICKED', 'EMAIL_BOUNCED', 'EMAIL_DROPPED', 'EMAIL_MARKED_AS_SPAM', 'EMAIL_UNSUBSCRIBED', 'POST_PUBLISHED', 'POST_UNPUBLISHED', 'POST_DELETED', 'POST_VIEWED', 'PRODUCT_VIEWED', 'FORM_VIEWED', 'FORM_SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "metric" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "metricType" "public"."metric_metrictype_enum" NOT NULL, "message" character varying NOT NULL, "data" jsonb, "signupFormId" uuid, "subscriberId" uuid, "listId" uuid, "postId" uuid, "storeId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7d24c075ea2926dd32bd1c534ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDefaultStoreList" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "starred" boolean NOT NULL DEFAULT false, "storeId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "newSubscriber" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."quest_questtype_enum" AS ENUM('DAILY', 'WEEKLY', 'MILESTONE', 'CUSTOME')`,
    );
    await queryRunner.query(
      `CREATE TABLE "quest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "questType" "public"."quest_questtype_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0d6873502a58302d2ae0b82631c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."challenge_challengetype_enum" AS ENUM('CHALLENGE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."challenge_measuredunit_enum" AS ENUM('PERCENTAGE', 'RATE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."challenge_measuredmetric_enum" AS ENUM('SHOPIFY_ORDERED_PRODUCT', 'SHOPIFY_REFUNDED_ORDER', 'SHOPIFY_PLACED_ORDER', 'SHOPIFY_CHECKOUT_STARTED', 'SHOPIFY_FULFILLED_ORDER', 'SHOPIFY_CANCELLED_ORDER', 'SHOPIFY_CANCELLED_ORDER_VALUE', 'SHOPIFY_CHECKOUT_STARTED_VALUE', 'SHOPIFY_FULFILLED_ORDER_VALUE', 'SHOPIFY_ORDERED_PRODUCT_VALUE', 'SHOPIFY_PLACED_ORDER_VALUE', 'SHOPIFY_REFUNDED_ORDER_VALUE', 'EMAIL_OPENED', 'EMAIL_DELIVERED', 'EMAIL_SENT', 'EMAIL_LINK_CLICKED', 'EMAIL_BOUNCED', 'EMAIL_DROPPED', 'EMAIL_MARKED_AS_SPAM', 'EMAIL_UNSUBSCRIBED', 'POST_PUBLISHED', 'POST_UNPUBLISHED', 'POST_DELETED', 'POST_VIEWED', 'PRODUCT_VIEWED', 'FORM_VIEWED', 'FORM_SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "challenge" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "measuredValue" integer, "completionCount" integer NOT NULL DEFAULT '1', "completionStages" integer NOT NULL DEFAULT '1', "challengeType" "public"."challenge_challengetype_enum" NOT NULL, "measuredUnit" "public"."challenge_measuredunit_enum", "measuredMetric" "public"."challenge_measuredmetric_enum", "isHidden" boolean NOT NULL DEFAULT false, "questId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5f31455ad09ea6a836a06871b7a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "store_challenge" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "completedCount" integer NOT NULL, "completedStages" integer NOT NULL, "storeId" uuid NOT NULL, "challengeId" uuid NOT NULL, "allCompleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f7220c487c5b1c86437bd8bb9e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow_transition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "otherWise" boolean NOT NULL DEFAULT false, "workflowId" uuid NOT NULL, "workflowStateId" uuid NOT NULL, "nextStateId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9dcbde65e2386a8e8de78585df2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workflow_state_workflowstatetype_enum" AS ENUM('START', 'NORMAL', 'COMPLETE', 'DENIED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workflow_state_workflowactivitytype_enum" AS ENUM('LIST_TRIGGER', 'METRIC_TRIGGER', 'SEND_EMAIL', 'DELAY', 'CONDITIONAL_SPLIT', 'TRIGGER_SPLIT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow_state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "workflowStateType" "public"."workflow_state_workflowstatetype_enum" NOT NULL, "value" jsonb NOT NULL, "workflowActivityType" "public"."workflow_state_workflowactivitytype_enum" NOT NULL, "workflowId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_78ea932fd6e23282848898c5710" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workflow_workflowstatus_enum" AS ENUM('DRAFT', 'INACTIVE', 'LIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "descriptionLexical" character varying, "descriptionHTML" character varying, "public" boolean NOT NULL DEFAULT false, "replicationCount" integer NOT NULL DEFAULT '0', "workflowStatus" "public"."workflow_workflowstatus_enum" NOT NULL DEFAULT 'DRAFT', "storeId" uuid NOT NULL, "flowFilter" jsonb, "triggerFilter" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_eb5e4cc1a9ef2e94805b676751b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."store_currency_enum" AS ENUM('USD', 'INR', 'EUR', 'AED', 'GBP', 'AUD', 'JPY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "store" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subdomain" text, "name" text, "shortId" text, "currency" "public"."store_currency_enum" NOT NULL DEFAULT 'USD', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "displayPictureId" uuid, "aboutId" uuid, "contactId" uuid, "integrationId" uuid, "billingId" uuid, "notificationId" uuid, CONSTRAINT "UQ_52a4191a987abb10a4120cba7d5" UNIQUE ("subdomain"), CONSTRAINT "REL_42ec9d743d1eed5898e7efb939" UNIQUE ("displayPictureId"), CONSTRAINT "REL_d7d5756004003f553adf1074ec" UNIQUE ("aboutId"), CONSTRAINT "REL_16225a153ee326462903033576" UNIQUE ("contactId"), CONSTRAINT "REL_85f89e6acd18b4d758a35a0cba" UNIQUE ("integrationId"), CONSTRAINT "REL_b24a29242c86a071dd6f077880" UNIQUE ("billingId"), CONSTRAINT "REL_7803c212e4dc92ce1cce627c35" UNIQUE ("notificationId"), CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "display_picture" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "height" integer NOT NULL, "width" integer NOT NULL, "src" text NOT NULL, CONSTRAINT "PK_6e9df7c281df3140ce0561ea046" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderName" character varying NOT NULL, "senderEmail" character varying NOT NULL, "address1" character varying NOT NULL, "address2" character varying, "city" character varying NOT NULL, "country" character varying NOT NULL, "state" character varying, "zipCode" character varying NOT NULL, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."about_industry_enum" AS ENUM('Ecommerce (Apparel & Accessories)', 'Ecommerce (Automotive)', 'Ecommerce (Electronics)', 'Ecommerce (Food & Beverage)', 'Ecommerce (Jewelry)', 'Ecommerce (Housewares, Home Furnishings, & Garden)', 'Ecommerce (Hardware & Home Improvement)', 'Ecommerce (Health & Beauty)', 'Ecommerce (Mass Merchant)', 'Ecommerce (Office Supplies)', 'Ecommerce (Specialty)', 'Ecommerce (Sporting Goods)', 'Ecommerce (Toys & Hobbies)', 'Ecommerce (Other)', 'Agency, Marketing, and Consulting', 'Banking, Financial Services, and Insurance', 'Education', 'Events & Entertainment', 'Non-Profit', 'Politics and Government', 'Real Estate and Construction', 'Restaurants', 'Telecommunications', 'Software / SaaS', 'Travel', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "about" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "about" character varying, "aboutLexical" character varying, "aboutHTML" character varying, "industry" "public"."about_industry_enum", CONSTRAINT "PK_e7b581a8a74d0a2ea3aa53226ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_5bd02a93f5b64c5f1d0d2c77781" FOREIGN KEY ("itemCategoryId") REFERENCES "item_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_item" ADD CONSTRAINT "FK_40b9bf33944256a6e5cbaac9262" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_item" ADD CONSTRAINT "FK_fda69506c0479b21637581c143a" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_item" ADD CONSTRAINT "FK_0fbd166b61190fb6f19d079bf7a" FOREIGN KEY ("creditId") REFERENCES "credit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit" ADD CONSTRAINT "FK_76a2db4938eeff223ae3683b432" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ADD CONSTRAINT "FK_e37748bf2b10b8be30849bde8d4" FOREIGN KEY ("shopifyId") REFERENCES "shopify"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_list" ADD CONSTRAINT "FK_3228a679dbc9ab28bb70bbed609" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_list" ADD CONSTRAINT "FK_5a960d906b5e7cb4632f7906f13" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_32eaa54ad96b26459158464379a" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_post" ADD CONSTRAINT "FK_75edb6baaf8ac8c8960417f448e" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_post" ADD CONSTRAINT "FK_da6ae7ddcc605d145e88b8cfeaa" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_bd12bd93775ba759a480584cbd3" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "signup_form" ADD CONSTRAINT "FK_7bd9ecd8d0bca410f386026cdec" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "signup_form" ADD CONSTRAINT "FK_2e3dabee5ce3ad86f986ac3b84a" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber_list" ADD CONSTRAINT "FK_5446b01fb227a6de3abb04edbc0" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber_list" ADD CONSTRAINT "FK_b0597ca255f9871b0fe26d9af88" FOREIGN KEY ("subscriberId") REFERENCES "subscriber"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber_list" ADD CONSTRAINT "FK_bf7bd8797231d19970bc3d377d8" FOREIGN KEY ("emailConcentId") REFERENCES "email_concent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_01cd2b829e0263917bf570cb672" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_e1352f3eacfce12c2b7bcc5b9f8" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_cb05b4115235acbc219cbb647a1" FOREIGN KEY ("userEmailDeliveryStatusId") REFERENCES "user_email_delivery_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber" ADD CONSTRAINT "FK_927ba2d264415d62e38f0a4a1f6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber" ADD CONSTRAINT "FK_71d801febb36987915cf3e1e247" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber" ADD CONSTRAINT "FK_4e2a08770681d650906e2ee3bcb" FOREIGN KEY ("subscriberAddressId") REFERENCES "subscriber_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" ADD CONSTRAINT "FK_08b14a7f271ba77a95f9bd65005" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" ADD CONSTRAINT "FK_3393c27ba3b52334ca51070a234" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" ADD CONSTRAINT "FK_b3ef9300d89b46cb024d4fc18d1" FOREIGN KEY ("subscriberId") REFERENCES "subscriber"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" ADD CONSTRAINT "FK_018742aa3dc41a9381ef7a8567f" FOREIGN KEY ("signupFormId") REFERENCES "signup_form"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" ADD CONSTRAINT "FK_b16817c37aa3e12868cd0456a61" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list" ADD CONSTRAINT "FK_e1208628a04a52d1cb766c74652" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge" ADD CONSTRAINT "FK_b50f27bc95678a26486dc8610d6" FOREIGN KEY ("questId") REFERENCES "quest"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_challenge" ADD CONSTRAINT "FK_47c2723b1788c5bbea2bfbc2195" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_challenge" ADD CONSTRAINT "FK_f604b5de65efddadcef81f59d71" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_transition" ADD CONSTRAINT "FK_907ac2f87497624f7d60efe2927" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_transition" ADD CONSTRAINT "FK_8b7225273dc89a28d027c73db66" FOREIGN KEY ("workflowStateId") REFERENCES "workflow_state"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_state" ADD CONSTRAINT "FK_925c78c275d61b3514cfda22141" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" ADD CONSTRAINT "FK_95b61284305975cc33810a4c9f1" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_42ec9d743d1eed5898e7efb939c" FOREIGN KEY ("displayPictureId") REFERENCES "display_picture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_d7d5756004003f553adf1074ec7" FOREIGN KEY ("aboutId") REFERENCES "about"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_16225a153ee3264629030335763" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_85f89e6acd18b4d758a35a0cba8" FOREIGN KEY ("integrationId") REFERENCES "integration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_b24a29242c86a071dd6f0778804" FOREIGN KEY ("billingId") REFERENCES "billing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_7803c212e4dc92ce1cce627c35a" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store" DROP CONSTRAINT "FK_7803c212e4dc92ce1cce627c35a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" DROP CONSTRAINT "FK_b24a29242c86a071dd6f0778804"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" DROP CONSTRAINT "FK_85f89e6acd18b4d758a35a0cba8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" DROP CONSTRAINT "FK_16225a153ee3264629030335763"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" DROP CONSTRAINT "FK_d7d5756004003f553adf1074ec7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store" DROP CONSTRAINT "FK_42ec9d743d1eed5898e7efb939c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" DROP CONSTRAINT "FK_95b61284305975cc33810a4c9f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_state" DROP CONSTRAINT "FK_925c78c275d61b3514cfda22141"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_transition" DROP CONSTRAINT "FK_8b7225273dc89a28d027c73db66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_transition" DROP CONSTRAINT "FK_907ac2f87497624f7d60efe2927"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_challenge" DROP CONSTRAINT "FK_f604b5de65efddadcef81f59d71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_challenge" DROP CONSTRAINT "FK_47c2723b1788c5bbea2bfbc2195"`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge" DROP CONSTRAINT "FK_b50f27bc95678a26486dc8610d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list" DROP CONSTRAINT "FK_e1208628a04a52d1cb766c74652"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" DROP CONSTRAINT "FK_b16817c37aa3e12868cd0456a61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" DROP CONSTRAINT "FK_018742aa3dc41a9381ef7a8567f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" DROP CONSTRAINT "FK_b3ef9300d89b46cb024d4fc18d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" DROP CONSTRAINT "FK_3393c27ba3b52334ca51070a234"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metric" DROP CONSTRAINT "FK_08b14a7f271ba77a95f9bd65005"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber" DROP CONSTRAINT "FK_4e2a08770681d650906e2ee3bcb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber" DROP CONSTRAINT "FK_71d801febb36987915cf3e1e247"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber" DROP CONSTRAINT "FK_927ba2d264415d62e38f0a4a1f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_cb05b4115235acbc219cbb647a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_e1352f3eacfce12c2b7bcc5b9f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_01cd2b829e0263917bf570cb672"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber_list" DROP CONSTRAINT "FK_bf7bd8797231d19970bc3d377d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber_list" DROP CONSTRAINT "FK_b0597ca255f9871b0fe26d9af88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriber_list" DROP CONSTRAINT "FK_5446b01fb227a6de3abb04edbc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "signup_form" DROP CONSTRAINT "FK_2e3dabee5ce3ad86f986ac3b84a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "signup_form" DROP CONSTRAINT "FK_7bd9ecd8d0bca410f386026cdec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_bd12bd93775ba759a480584cbd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_post" DROP CONSTRAINT "FK_da6ae7ddcc605d145e88b8cfeaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_post" DROP CONSTRAINT "FK_75edb6baaf8ac8c8960417f448e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_32eaa54ad96b26459158464379a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_list" DROP CONSTRAINT "FK_5a960d906b5e7cb4632f7906f13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_list" DROP CONSTRAINT "FK_3228a679dbc9ab28bb70bbed609"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" DROP CONSTRAINT "FK_e37748bf2b10b8be30849bde8d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit" DROP CONSTRAINT "FK_76a2db4938eeff223ae3683b432"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_item" DROP CONSTRAINT "FK_0fbd166b61190fb6f19d079bf7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_item" DROP CONSTRAINT "FK_fda69506c0479b21637581c143a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_item" DROP CONSTRAINT "FK_40b9bf33944256a6e5cbaac9262"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_5bd02a93f5b64c5f1d0d2c77781"`,
    );
    await queryRunner.query(`DROP TABLE "about"`);
    await queryRunner.query(`DROP TYPE "public"."about_industry_enum"`);
    await queryRunner.query(`DROP TABLE "contact"`);
    await queryRunner.query(`DROP TABLE "display_picture"`);
    await queryRunner.query(`DROP TABLE "store"`);
    await queryRunner.query(`DROP TYPE "public"."store_currency_enum"`);
    await queryRunner.query(`DROP TABLE "workflow"`);
    await queryRunner.query(
      `DROP TYPE "public"."workflow_workflowstatus_enum"`,
    );
    await queryRunner.query(`DROP TABLE "workflow_state"`);
    await queryRunner.query(
      `DROP TYPE "public"."workflow_state_workflowactivitytype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."workflow_state_workflowstatetype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "workflow_transition"`);
    await queryRunner.query(`DROP TABLE "store_challenge"`);
    await queryRunner.query(`DROP TABLE "challenge"`);
    await queryRunner.query(
      `DROP TYPE "public"."challenge_measuredmetric_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."challenge_measuredunit_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."challenge_challengetype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "quest"`);
    await queryRunner.query(`DROP TYPE "public"."quest_questtype_enum"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "list"`);
    await queryRunner.query(`DROP TABLE "metric"`);
    await queryRunner.query(`DROP TYPE "public"."metric_metrictype_enum"`);
    await queryRunner.query(`DROP TABLE "subscriber_address"`);
    await queryRunner.query(`DROP TABLE "subscriber"`);
    await queryRunner.query(`DROP TYPE "public"."subscriber_emailstatus_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."subscriber_subscribertype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "user_email_delivery_status"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_email_delivery_status_emaildeliverystatus_enum"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(
      `DROP TYPE "public"."event_eventaccessrestriction_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."event_eventstate_enum"`);
    await queryRunner.query(`DROP TYPE "public"."event_eventtype_enum"`);
    await queryRunner.query(`DROP TABLE "email_concent"`);
    await queryRunner.query(
      `DROP TYPE "public"."email_concent_collectedfrom_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."email_concent_optinlevel_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."email_concent_state_enum"`);
    await queryRunner.query(`DROP TABLE "subscriber_list"`);
    await queryRunner.query(`DROP TABLE "signup_form"`);
    await queryRunner.query(`DROP TYPE "public"."signup_form_formstate_enum"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TYPE "public"."post_posttype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."post_poststate_enum"`);
    await queryRunner.query(`DROP TABLE "product_post"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TYPE "public"."product_productsource_enum"`);
    await queryRunner.query(`DROP TYPE "public"."product_producttype_enum"`);
    await queryRunner.query(`DROP TABLE "post_list"`);
    await queryRunner.query(`DROP TABLE "integration"`);
    await queryRunner.query(`DROP TABLE "shopify"`);
    await queryRunner.query(`DROP TABLE "credit"`);
    await queryRunner.query(`DROP TABLE "store_item"`);
    await queryRunner.query(`DROP TABLE "item"`);
    await queryRunner.query(`DROP TYPE "public"."item_type_enum"`);
    await queryRunner.query(`DROP TABLE "item_category"`);
    await queryRunner.query(`DROP TYPE "public"."item_category_type_enum"`);
    await queryRunner.query(`DROP TABLE "billing"`);
    await queryRunner.query(
      `DROP TYPE "public"."billing_billingsubscriptionentity_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."billing_billingsubscriptionstatus_enum"`,
    );
  }
}
