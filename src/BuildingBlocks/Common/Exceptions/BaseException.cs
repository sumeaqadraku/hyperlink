namespace Common.Exceptions;

public abstract class BaseException : Exception
{
    public string Code { get; }

    protected BaseException(string code, string message) : base(message)
    {
        Code = code;
    }

    protected BaseException(string code, string message, Exception innerException)
        : base(message, innerException)
    {
        Code = code;
    }
}

public class NotFoundException : BaseException
{
    public NotFoundException(string entityName, object id)
        : base("NOT_FOUND", $"{entityName} with id {id} was not found")
    {
    }
}

public class ValidationException : BaseException
{
    public Dictionary<string, string[]> Errors { get; }

    public ValidationException(Dictionary<string, string[]> errors)
        : base("VALIDATION_ERROR", "One or more validation errors occurred")
    {
        Errors = errors;
    }
}

public class BusinessRuleException : BaseException
{
    public BusinessRuleException(string message)
        : base("BUSINESS_RULE_VIOLATION", message)
    {
    }
}
