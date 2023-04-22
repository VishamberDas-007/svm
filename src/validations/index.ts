const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
}

export default async (validator: any, body: any) => {
    await validator.validateAsync(body, options)
}
