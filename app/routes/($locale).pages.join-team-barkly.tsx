import {json, type ActionFunction} from '@shopify/remix-oxygen';
import {Form, useActionData} from '@remix-run/react';
import {useState, useEffect, useRef} from 'react';

interface State {
  value: string;
  label: string;
}

interface ActionData {
  success?: boolean;
  error?: string;
  handle?: string;
}

interface FloatingLabelInputProps {
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder: string;
  className?: string;
}

interface FloatingLabelTextareaProps {
  id: string;
  name: string;
  required?: boolean;
  placeholder: string;
  height?: string;
}

const AUSTRALIAN_STATES: State[] = [
  {value: 'ACT', label: 'Australian Capital Territory'},
  {value: 'NSW', label: 'New South Wales'},
  {value: 'NT', label: 'Northern Territory'},
  {value: 'QLD', label: 'Queensland'},
  {value: 'SA', label: 'South Australia'},
  {value: 'TAS', label: 'Tasmania'},
  {value: 'VIC', label: 'Victoria'},
  {value: 'WA', label: 'Western Australia'},
];

export const action: ActionFunction = async ({request, context}) => {
  const formData = await request.formData();

  const fields = [
    'name',
    'email',
    'events_you_compete_in',
    'tell_us_about_yourself',
    'associations_you_compete_under',
    'achievements',
    'your_future_ambitions_and_goals',
    'other_companies_that_sponsor_you',
    'home_state',
    'instagram_url',
    'facebook_url',
  ];

  const metaobjectFields = fields.map((field) => ({
    key: field,
    value: formData.get(field)?.toString() || '',
  }));

  try {
    const response = await fetch(
      `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': context.env.PRIVATE_SHOPIFY_ADMIN_API_TOKEN,
        },
        body: JSON.stringify({
          query: `
          mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
            metaobjectCreate(metaobject: $metaobject) {
              metaobject {
                handle
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
          variables: {
            metaobject: {
              type: 'join_team_barkly',
              fields: metaobjectFields,
            },
          },
        }),
      },
    );

    const data = (await response.json()) as {
      errors?: Array<{message: string}>;
      data?: {
        metaobjectCreate?: {
          metaobject: {handle: string};
          userErrors: Array<{field: string[]; message: string}>;
        };
      };
    };

    if (data.errors) {
      // eslint-disable-next-line no-console
      console.error('GraphQL Errors:', data.errors);
      return json({error: data.errors[0].message}, {status: 400});
    }

    // Add null check for metaobjectCreate
    const metaobjectCreate = data.data?.metaobjectCreate;
    if (!metaobjectCreate) {
      return json({error: 'Invalid response from server'}, {status: 400});
    }

    // Add null check for userErrors
    const userErrors = metaobjectCreate.userErrors;
    if (userErrors?.length > 0) {
      return json({error: userErrors[0].message}, {status: 400});
    }

    return json({
      success: true,
      handle: metaobjectCreate.metaobject.handle,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Request Error:', error);
    return json({error: 'Failed to submit application'}, {status: 500});
  }
};

const FloatingLabelInput = ({
  id,
  name,
  type = 'text',
  required = false,
  placeholder,
  className = '',
}: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        placeholder=" "
        className={`peer bg-contrast border-primary/10 rounded w-full pt-4 pb-2 px-3 text-base ${className}`}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value.length > 0);
        }}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none
          ${
            isFocused || hasValue
              ? 'text-xs top-1 text-primary/60'
              : 'text-base top-3 text-primary/40'
          }`}
      >
        {placeholder}
      </label>
    </div>
  );
};

const FloatingLabelTextarea = ({
  id,
  name,
  required = false,
  placeholder,
  height = 'h-24',
}: FloatingLabelTextareaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      <textarea
        id={id}
        name={name}
        required={required}
        placeholder=" "
        className={`peer bg-contrast border-primary/10 rounded w-full pt-6 pb-2 px-3 ${height} text-base`}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value.length > 0);
        }}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none
          ${
            isFocused || hasValue
              ? 'text-xs top-1 text-primary/60'
              : 'text-base top-3 text-primary/40'
          }`}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default function JoinTeam() {
  const actionData = useActionData<typeof action>() as ActionData;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset();
    }
  }, [actionData?.success]);

  return (
    <div className="w-full px-6 md:px-8 lg:px-12">
      <div className="max-w-[600px] mx-auto my-6 md:my-8">
        <div className="grid gap-8">
          {/* Introduction Section */}
          <div className="grid gap-6">
            <div className="grid gap-4">
              <h1 className="font-sans text-3xl font-bold">
                Be a Part of a Wonderful Team
              </h1>

              <div className="grid gap-4 text-primary/80 leading-relaxed">
                <p>
                  Are you passionate about riding and looking for an opportunity
                  to showcase your skills? Team Barkly is excited to announce
                  that we are on the lookout for dedicated and enthusiastic
                  riders to join us as sponsored athletes! This is a fantastic
                  chance to be part of a community that values style,
                  durability, and a love for the outdoors.
                </p>

                <p>
                  As a sponsored rider, you will not only represent the Barkly
                  brand but also embody the spirit of adventure and exploration
                  that our products are designed for. We believe in supporting
                  riders who share our passion for quality and craftsmanship,
                  and we want to help you elevate your riding experience with
                  our curated selection of apparel and accessories.
                </p>

                <p>
                  Joining Team Barkly means you&apos;ll have access to exclusive
                  gear, promotional opportunities, and the chance to connect
                  with fellow riders who share your enthusiasm. We are committed
                  to fostering a supportive environment where you can thrive and
                  showcase your talents, whether you&apos;re hitting the trails
                  or participating in competitions.
                </p>

                <p>
                  We are looking for riders who are not only skilled but also
                  embody the values of our brand—integrity, passion, and a love
                  for the great outdoors. If you have a strong social media
                  presence and are eager to share your riding journey with
                  others, we want to hear from you!
                </p>

                <p>
                  To apply, simply reach out to us through the below form and
                  tell us about your riding experience, your goals, and why you
                  would be a great fit for Team Barkly. We can&apos;t wait to
                  see how you can contribute to our community and represent our
                  brand with pride.
                </p>

                <p>
                  Join us in celebrating the thrill of riding and the beauty of
                  Australia&apos;s landscapes. Together, we can inspire others
                  to embrace their adventurous spirit and enjoy the journey
                  ahead!
                </p>
              </div>
            </div>
          </div>

          {/* Application Form Section */}
          <div className="max-w-[600px] mx-auto w-full">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <h2 className="font-sans text-2xl font-bold">Apply Now</h2>
                <p className="text-primary/80 text-base">
                  We&apos;re excited to learn more about you. Please fill out
                  the form below to apply.
                </p>
              </div>

              <Form ref={formRef} method="post" className="grid gap-4">
                {/* Basic Information */}
                <div className="grid gap-3">
                  <h2 className="font-sans text-sm font-medium uppercase tracking-wide text-primary/60">
                    Basic Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-3">
                    <FloatingLabelInput
                      id="name"
                      name="name"
                      required
                      placeholder="Name"
                    />
                    <FloatingLabelInput
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Email"
                    />
                  </div>

                  <div className="relative">
                    <select
                      id="home_state"
                      name="home_state"
                      className="bg-contrast border-primary/10 rounded w-full py-3 px-3 appearance-none"
                      required
                    >
                      <option value="">Select a state</option>
                      {AUSTRALIAN_STATES.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Competition Information */}
                <div className="grid gap-3">
                  <h2 className="font-sans text-sm font-medium uppercase tracking-wide text-primary/60">
                    Competition Information
                  </h2>

                  <FloatingLabelTextarea
                    id="events_you_compete_in"
                    name="events_you_compete_in"
                    required
                    placeholder="Events You Compete In"
                    height="h-24"
                  />

                  <FloatingLabelTextarea
                    id="associations_you_compete_under"
                    name="associations_you_compete_under"
                    required
                    placeholder="Associations You Compete Under"
                    height="h-24"
                  />

                  <FloatingLabelTextarea
                    id="achievements"
                    name="achievements"
                    placeholder="Achievements"
                    height="h-24"
                  />
                </div>

                {/* Personal Information */}
                <div className="grid gap-3">
                  <h2 className="font-sans text-sm font-medium uppercase tracking-wide text-primary/60">
                    Personal Information
                  </h2>

                  <FloatingLabelTextarea
                    id="tell_us_about_yourself"
                    name="tell_us_about_yourself"
                    required
                    placeholder="Tell Us About Yourself"
                    height="h-32"
                  />

                  <FloatingLabelTextarea
                    id="your_future_ambitions_and_goals"
                    name="your_future_ambitions_and_goals"
                    required
                    placeholder="Your Future Ambitions and Goals"
                    height="h-32"
                  />

                  <FloatingLabelTextarea
                    id="other_companies_that_sponsor_you"
                    name="other_companies_that_sponsor_you"
                    placeholder="Other Companies That Sponsor You"
                    height="h-20"
                  />
                </div>

                {/* Social Media */}
                <div className="grid gap-3">
                  <h2 className="font-sans text-sm font-medium uppercase tracking-wide text-primary/60">
                    Social Media
                  </h2>

                  <div className="grid md:grid-cols-2 gap-3">
                    <FloatingLabelInput
                      id="instagram_url"
                      name="instagram_url"
                      placeholder="Instagram Username"
                    />
                    <FloatingLabelInput
                      id="facebook_url"
                      name="facebook_url"
                      placeholder="Facebook Profile"
                    />
                  </div>
                </div>

                <hr className="border-primary/10 my-2" />

                <button
                  type="submit"
                  className="bg-primary text-contrast rounded py-3 px-6 w-full font-medium hover:bg-primary/90 transition-colors"
                >
                  Submit Application
                </button>
              </Form>

              {actionData?.error && (
                <div className="bg-notice/10 text-notice rounded p-4">
                  {actionData.error}
                </div>
              )}

              {actionData?.success && (
                <div className="bg-primary/10 text-primary rounded p-4">
                  Thank you for your application! We&apos;ll review it and get
                  back to you soon.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
